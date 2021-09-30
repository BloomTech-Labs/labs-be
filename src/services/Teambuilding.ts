import { FieldSet, Records } from "airtable";
import ProjectsDao from "@daos/Airtable/ProjectsDao";
import SurveyDao from "@daos/Airtable/SurveyDao";
import UsersDao from "@daos/Canvas/UsersDao";
import CanvasCoursesDao from "@daos/Airtable/CanvasCoursesDao";
import QuizSubmissionDao from "@daos/Canvas/QuizSubmissionDao";
import QuizSubmissionQuestionsDao from "@daos/Canvas/QuizSubmissionQuestionsDao";
import StudentDao from "@daos/Airtable/StudentDao";
import QuizSubmission from "@entities/QuizSubmission";
import {
  getRoleQuizIds,
  getFinalApplicationQuizIds,
  getLambdaId
} from "@services/Airtable";
import QuizReportDao from "@daos/Canvas/QuizReportDao";
import { QuizReportType } from "@entities/QuizReport";
import { mergeObjectArrays } from "@shared/functions";
import GroupsDao from "@daos/Canvas/GroupsDao";
import TeambuildingOutput, {
  RoleQuizScores,
  RoleRankings,
  Track
} from "@entities/TeambuildingOutput";
import TeambuildingPayload, {
  ILearnerRoleQuizScores,
  ILearnerRoleRankings,
  ILearnerSurvey,
  ILearnerLabsApplication,
  IProject
} from "@entities/TeambuildingPayload";
import SortingHatDao from "@daos/SortingHat/SortingHatDao";


const projectsDao = new ProjectsDao();
const surveyDao = new SurveyDao();
const canvasCoursesDao = new CanvasCoursesDao();
const groupsDao = new GroupsDao();
const sortingHatDao = new SortingHatDao();
const studentDao = new StudentDao();
const usersDao = new UsersDao();
const quizReportDao = new QuizReportDao();
const quizSubmissionDao = new QuizSubmissionDao();
const quizSubmissionQuestionsDao = new QuizSubmissionQuestionsDao();


type RoleQuizID = Record<string,number>;


/**
 * Attempt to parse a Track from a string. Airtable formats tracks as e.g.
 * "Web (Node)".
 *
 * @param surveys
 * @returns
 */
function parseTrack (track: string): Track | null {
  switch (track) {
    case "Web (Node)" || "Web":
      return Track.WEB;
    case "DS":
      return Track.DS;
    default:
      return null;
  }
}


/**
 * Given an array of raw teambuilding survey results, parse it into an array of
 * ILearnerSurveys.
 *
 * @param surveys
 * @returns
 */
async function parseSurveys (surveys: Records<FieldSet>): Promise<ILearnerSurvey[]> {
  const learnerSurveys = await Promise.all(surveys.map(async survey => {
    const record = survey.fields;

    // The "dontWorkWith" field is an array of Airtable record IDs. We need
    // Lambda IDs.
    const enemies =
      (record ["List the names of up to 5 students you do not want to work with"] ||
      []) as
      string [];
    const dontWorkWith = await Promise.all(enemies
      .map (async (enemyRecordId) => {
        const lambdaId = await getLambdaId(enemyRecordId);
        return lambdaId;
      })
      .filter (y => y)) as string[];

    const learnerSurvey: ILearnerSurvey = {
      name: (record ["Student Name"] as string[])[0],
      lambdaId: (record ["Lambda ID"] as string[])[0],
      smtId: record ["SMT ID"] as string,
      track: parseTrack (record ["Track"] as string) as Track,
      gitExpertise: record ["Git Expertise"] as number,
      dockerExpertise: record ["Docker Expertise"] as number,
      playByEar: record ["Do you plan ahead or play it by ear?"] as number,
      detailOriented:
        record ["Are you more interested in the big picture or details?"] as number,
      speakUpInDiscussions:
        record ["How often do you speak up during group discussions?"] as number,
      diversityConsent: (record ["Consent"] || false) as boolean,
      genderIdentity: record ["Gender"] as string,
      ethnicities: record ["Ethnicities"] as string[],
      dontWorkWith,
    };
    return learnerSurvey;
  }));

  return learnerSurveys;
}


/**
 * Given an array of raw project results, parse it into an array of
 * IProjects.
 *
 * @param projects
 * @returns
 */
function parseProjects (projects: Records<FieldSet>): IProject[] {
  return projects.map(x => {
    const record = x.fields;
    const project: IProject = {
      id: record ["Name"] as string,
      product: (record ["Product Name"] as string[])[0],
      teamCode: record ["Team Code"] as string,
      tracks: (() => {
        const tracks = record ["Tracks"] as string[];
        return tracks.map (track => parseTrack(track));
      })(),
      releaseManager: (record ["Release Manager"] as string[])[0],
      teamMemberSmtIds: record ["Team Members"] as string[],
    };
    return project;
  });

}


/**
 * Given an array of IProjects, get info on the continuing learners for each project
 * from Airtable.
 *
 * @param projects
 * @returns
 */
async function getContinuingLearners (
  projects: IProject[]
): Promise<Record<string, unknown>[]> {
  const continuingLearners = [] as Record<string,unknown>[];
  for (const project of projects) {
    // For each team member on the project, get their relevant properties.
    for (const smtId of project.teamMemberSmtIds || []) {
      const student = await studentDao.getByRecordId(smtId);
      if (!student) {
        continue;
      }
      const lambdaId = (student ["Lambda ID"] as string[]) [0];
      const name = student ["Name"] as string; 
      const labsRoles = student ["Labs Role"] as string[] | null;
      const labsRole = labsRoles ? labsRoles [0] : null;
      const survey = await (surveyDao.getOne(lambdaId));
      const surveyFields = survey?.fields as Record <string, unknown>;
      const track = surveyFields ? surveyFields ["Student Course Text"] as Track : null;
      const learner = {
        lambdaId,
        name,
        track,
        labsRole,
        labsProject: project.id
      };
      continuingLearners.push(learner);
    }
  }
  return continuingLearners;
}


/**
 * Build a TeambuildingPayload by merging surveys, projects, quiz scores, and rankings.
 *
 * @param surveys
 * @param quizScores
 * @param rankings
 * @param projects
 * @returns
 */
async function buildTeambuildingPayload (
  surveys: ILearnerSurvey[],
  quizScores: ILearnerRoleQuizScores[],
  rankings: ILearnerRoleRankings[],
  projects: IProject[]
): Promise<TeambuildingPayload> {
  const payload = {} as TeambuildingPayload;

  // Get necessary info on the existing projects.
  const continuingLearners = await getContinuingLearners (projects);

  // Merge everything together.
  let learners = mergeObjectArrays (
    "lambdaId",
    [surveys, quizScores, rankings, continuingLearners]
  ) as Record<string, unknown>[];

  // Filter out incoming learners who didn't fill out the survey (no existing
  // Labs Project and no "gitExpertise" field.
  learners = learners.filter (x => x.gitExpertise || x.labsProject);
  
  // Make sure all desired ILearnerLabsApplication fields are present for each learner.
  learners = learners.map(x =>({
    lambdaId: x.lambdaId,
    canvasUserId: x.canvasUserId || null,
    name: x.name || null,
    track: x.track || null,
    labsRole: x.labsRole || null,
    labsProject: x.labsProject || null,
    roleQuizScores: x.roleQuizScores || {},
    roleRankings: x.roleRankings || {},
    gitExpertise: x.gitExpertise || null,
    dockerExpertise: x.dockerExpertise || null,
    playByEar: x.playByEar || null,
    detailOriented: x.detailOriented || null,
    speakUpInDiscussions: x.speakUpInDiscussions || null,
    diversityConsent: x.bodiversityConsentolean || null,
    genderIdentity: x.genderIdentity || null,
    ethnicities: x.ethnicities || null,
    dontWorkWith: x.dontWorkWith || null,
  }));

  payload.learners = learners as unknown as ILearnerLabsApplication [];
  payload.projects = projects;

  return payload;
}


/**
 * Filter Canvas results by the specified cohort group in the given course.
 * 
 * @param answer
 * @param answers
 * @param matches
 */
export async function filterByCohort<T> (
  learners: T[],
  courseId: number,
  cohort: string
): Promise<T[]> {
  // Get all groups in the given course.
  const groups = await groupsDao.getGroupsInCourse(courseId);

  // Get all users in this cohort's group.
  const groupId = (groups?.find (x => x.name === cohort) || {}).id;
  if (!groupId) {
    throw new Error ("Group ID not found.");
  }
  const users = await usersDao.getUsersInGroup(groupId);
  
  // Filter learners
  return learners.filter(
    quiz => users?.find(
      user => user.sis_user_id === (quiz as Record<string,unknown>).lambdaId
    )
  );
}


/**
 * Get the given cohort's Role Quiz scores from the Labs Application in Canvas.
 * 
 * roleQuizIds is an object of the form:
 * [
 *   { "Technical Project Manager": number },
 *   ...
 *   { "UX Engineer": number }
 * ]

 * Returns an object of the form:
 * [
 *   {
 *     canvasUserId: number,
 *     roleQuizScores: {
 *         "Technical Project Manager": number,
 *         "Data Engineer": number,
 *          ...
 *         "UX Engineer": number
 *       },
 *   }
 * ]
 *
 * @param courseId
 * @param lambdaId
 * @returns
 */
export async function getRoleQuizScores (
  cohort: string,
  courseId: number,
  roleQuizIds: Record<string, number>[]
): Promise<ILearnerRoleQuizScores[]> {

  let learnerQuizzes: ILearnerRoleQuizScores[] = [] as ILearnerRoleQuizScores[];

  // For each role quiz:
  for (const roleQuiz of roleQuizIds) {
    // Get all submissions for the quiz.
    const role = Object.keys (roleQuiz)[0];
    const quizId = roleQuiz [role];
    const quizSubmissions: QuizSubmission[] | null =
      await quizSubmissionDao.getAll (courseId, quizId);
    if (!quizSubmissions) {
      continue;
    }

    // Collect role quiz scores in learnerQuizzes array
    for (const quizSubmission of quizSubmissions) {
      const existing =
        learnerQuizzes.find (x => x.canvasUserId === quizSubmission.user_id);
      if (existing) {
        existing.roleQuizScores [role] = quizSubmission.kept_score;
      } else {
        const canvasUser = await usersDao.getOne(quizSubmission.user_id);
        const lambdaId = canvasUser?.sis_user_id;
        const entry = {
          canvasUserId: quizSubmission.user_id,
          lambdaId,
          roleQuizScores: {} as RoleQuizScores,
        };
        entry.roleQuizScores [role] = quizSubmission.kept_score;
        learnerQuizzes.push (entry);
      }
    }
  }

  learnerQuizzes = await filterByCohort(learnerQuizzes, courseId, cohort);
  
  return learnerQuizzes;
}


/**
 * Parse role rankings from a Quiz Report field string.
 * 
 * @param answer
 * @param answers
 * @param matches
 */
function parseRoleRankings(answer: string): RoleRankings {
  // Empty:
  //   "1 (Highest Priority)=>,
  //    2=>,
  //    3=>,
  //    4 ( Lowest Priority)=>"
  // With ranks:
  //   "1 (Highest Priority)=>Data Engineer,
  //    2=>Technical Project Manager,
  //    3=>Data Scientist: ML Ops,
  //    4 ( Lowest Priority)=>Machine Learning Engineer"

  const rankings: RoleRankings = {};
   
  for (const x of answer.split(",")) {
    const role: string | undefined = x.split("=>")[1];
    const rank: number = parseInt(x[0]);
    if (role) {
      rankings [role] = rank;
    }
  }

  return rankings;
}



/**
 * Get the given cohort's Role rankings from the Labs Application in Canvas.
 * 
 * roleQuizIds is an object of the form:
 * [
 *   { "Technical Project Manager": number },
 *   ...
 *   { "UX Engineer": number }
 * ]

 * Returns an object of the form:
 * [
 *   {
 *     canvasUserId: number,
 *     roleRankings: {
 *         "Technical Project Manager": number,
 *         "Data Engineer": number,
 *          ...
 *         "UX Engineer": number
 *       },
 *   }
 * ]
 *
 * @param courseId
 * @param lambdaId
 * @returns
 */
export async function getRoleRankings (
  cohort: string,
  courseId: number,
  finalQuizIds: Record<string, number>
): Promise<ILearnerRoleRankings[] | undefined> {
  let learnerRankings: ILearnerRoleRankings[] = [] as ILearnerRoleRankings[];

  // For each Final Application quiz:
  for (const quizId of Object.values(finalQuizIds)) {

    const report: Record<string, unknown>[] | null =
      await quizReportDao.getFile (
        courseId, quizId, QuizReportType.student_analysis
      ) as Record<string, unknown>[] | null;

    const roleRankings: ILearnerRoleRankings[] | undefined = report?.map(x => {

      let rankingsString = "";
      for (const key of Object.keys(x)) {
        if (key.includes("Please rank your priorities for a role in Labs")) {
          rankingsString = x [key] as string;
        }
      }
      
      return {
        name: x.name as string,
        lambdaId: x.sis_id as string,
        canvasUserId: parseInt(x.id as string),
        roleRankings: parseRoleRankings (rankingsString),
      }
    }) as ILearnerRoleRankings[] | undefined;

    if (roleRankings) {
      learnerRankings.push (...roleRankings);
    }
  }

  learnerRankings = await filterByCohort(learnerRankings, courseId, cohort);
  
  return learnerRankings;
}


/**
 * Process teambuilding for a given cohort. See /docs/teambuilding.md
 * 
 * Relies on the cohort view already having been created in "Labs - Projects",
 * including each project row with any continuing learners already added.
 * 
 *   - Get existing teams from Airtable
 *   - Get surveys from Airtable
 *   - Get new Labs Applications from Canvas
 *     - Role Quiz Scores
 *     - Role Rankings from Final Application quiz (Web + DS)
 *   - POST one JSON body to DS SortingHat in "tidy" format
 *   - TODO: Write teams to "Labs - Projects" table in SMT
 *
 * @param eventType
 * @param eventDate
 * @param learners
 * @returns
 */
export async function processTeambuilding(
  cohort: string,
): Promise<TeambuildingOutput | null> {
// ): Promise<TeambuildingPayload | null> {

  // Get this cohort's set of projects from Airtable.
  const projects: IProject[] = parseProjects(await projectsDao.getCohort(cohort));

  // Get this cohort's surveys from Airtable.
  const surveys: ILearnerSurvey[] =
    await parseSurveys(await surveyDao.getCohort(cohort));

  // Get the Labs Application role quiz IDs from Airtable.
  const roleQuizIds: RoleQuizID[] = await getRoleQuizIds() as RoleQuizID[];

  // Get the ID of the Labs Application course from Airtable.
  const courseId: number = await canvasCoursesDao.getLabsApplicationCourseId() as number;

  // Get the Labs Application "Final Application" quiz IDs from Airtable.
  const finalApplicationQuizIds: Record<string, number> =
    await getFinalApplicationQuizIds();

  // Get this cohort's Role Quiz scores from the Labs Application in Canvas.
  const roleQuizScores = await getRoleQuizScores(cohort, courseId, roleQuizIds);

  // Get this cohort's role rankings from the Labs Application in Canvas.
  const roleRankings =
    (await getRoleRankings(cohort, courseId, finalApplicationQuizIds)) || [];

  // Merge the quiz scores, rankings, surveys, and projects.
  const payload =
    await buildTeambuildingPayload(surveys, roleQuizScores, roleRankings, projects);

  const output = await sortingHatDao.postBuildTeams(payload,cohort);

  return output;
}