import { FieldSet, Records } from "airtable";
import ProjectsDao from "@daos/Airtable/ProjectsDao";
import SurveyDao from "@daos/Airtable/SurveyDao";
import StudentDao from "@daos/Airtable/StudentDao";
import { parseTrack } from "@entities/TeambuildingOutput";
import { mergeObjectArrays } from "@shared/functions";
import TeambuildingOutput, { Track } from "@entities/TeambuildingOutput";
import TeambuildingPayload, {
  ILearnerSurvey,
  ILearnerLabsApplication,
  ITeamBuildingProject,
} from "@entities/TeambuildingPayload";
import SortingHatDao from "@daos/SortingHat/SortingHatDao";

const projectsDao = new ProjectsDao();
const surveyDao = new SurveyDao();
const sortingHatDao = new SortingHatDao();
const studentDao = new StudentDao();

/**
 * Given an array of raw teambuilding survey results, parse it into an array of
 * ILearnerSurveys.
 *
 * @param surveys
 * @returns
 */
async function parseSurveys(
  surveys: Records<FieldSet>
): Promise<ILearnerSurvey[]> {
  const learnerSurveys = await Promise.all(
    surveys.map((survey) => {
      const record = survey.fields;
      const learnerSurvey: ILearnerSurvey = {
        name: (record["Student Name"] as string[])[0],
        lambdaId: (record["Lambda ID"] as string[])[0],
        smtId: record["SMT ID"] as string,
        track: parseTrack(record["Track"] as string) as Track,
        gitExpertise: record["Git Expertise"] as number,
        dockerExpertise: record["Docker Expertise"] as number,
        playByEar: record["Do you plan ahead or play it by ear?"] as number,
        detailOriented: record[
          "Are you more interested in the big picture or details?"
        ] as number,
        speakUpInDiscussions: record[
          "How often do you speak up during group discussions?"
        ] as number,
        soloOrSocial: record["What activities do you prefer?"] as string,
        meaningOrValue: record["Which do you prefer to seek?"] as string,
        feelsRightOrMakesSense: record["Choices are easier when..."] as string,
        favoriteOrCollect: record["Which method do you prefer?"] as string,
        tpmSkill1: record["TPM Skill 1"] as string,
        tpmSkill2: record["TPM Skill 2"] as string,
        tpmSkill3: record["TPM Skill 3"] as string,
        tpmInterest1: record["TPM Interest 1"] as number,
        tpmInterest2: record["TPM Interest 2"] as number,
        tpmInterest3: record["TPM Interest 3"] as number,
        tpmInterest4: record["TPM Interest 4"] as number,
        uxInterest1: record["UX Interest 1"] as number,
        uxInterest2: record["UX Interest 2"] as number,
        frontendInterest1: record["Frontend Interest 1"] as number,
        frontendInterest2: record["Frontend Interest 2"] as number,
        backendInterest1: record["Backend Interest 1"] as number,
        backendInterest2: record["Backend Interest 2"] as number,
        dataEngInterest1: record["Data Engineer Interest 1"] as number,
        dataEngInterest2: record["Data Engineer Interest 2"] as number,
        dataEngInterest3: record["Data Engineer Interest 3"] as number,
        mlEngInterest1: record[
          "Machine Learning Engineer Interest 1"
        ] as number,
        mlEngInterest2: record[
          "Machine Learning Engineer Interest 2"
        ] as number,
        mlEngInterest3: record[
          "Machine Learning Engineer Interest 3"
        ] as number,
        mlOpsInterest1: record["ML Ops Interest 1"] as number,
        mlOpsInterest2: record["ML Ops Interest 2"] as number,
        mlOpsInterest3: record["ML Ops Interest 3"] as number,
      };
      return learnerSurvey;
    })
  );

  return learnerSurveys;
}

/**
 * Given an array of raw project results, parse it into an array of
 * ITeamBuildingProjects.
 *
 * @param projects
 * @returns
 */
function parseProjects(projects: Records<FieldSet>): ITeamBuildingProject[] {
  return projects.map((x) => {
    const record = x.fields;
    const project: ITeamBuildingProject = {
      id: record["Name"] as string,
      product: (record["Product Name"] as string[])[0],
      teamCode: record["Team Code"] as string,
      tracks: (() => {
        const tracks = record["Tracks"] as string[];
        return tracks.map((track) =>
          parseTrack(track) === Track.WEB ? "Web" : parseTrack(track)
        );
      })(),
      releaseManager: (record["Release Manager"] as string[])[0],
      teamMemberSmtIds: (record["Team Members"] || []) as string[],
    };
    return project;
  });
}

/**
 * Given an array of ITeamBuildingProjects, get info on the continuing learners for
 * each project from Airtable.
 *
 * @param projects
 * @returns
 */
async function getContinuingLearners(
  projects: ITeamBuildingProject[]
): Promise<Record<string, unknown>[]> {
  const continuingLearners = [] as Record<string, unknown>[];
  for (const project of projects) {
    // For each team member on the project, get their relevant properties.
    for (const smtId of project.teamMemberSmtIds || []) {
      const student = await studentDao.getByRecordId(smtId);
      if (!student) {
        continue;
      }
      const lambdaId = (student["Lambda ID"] as string[])[0];
      const name = student["Name"] as string;
      const labsRoles = student["Labs Role"] as string[] | null;
      const labsRole = labsRoles ? labsRoles[0] : null;
      const survey = await surveyDao.getOne(lambdaId);
      const surveyFields = survey?.fields as Record<string, unknown>;
      const track = surveyFields
        ? (surveyFields["Student Course Text"] as Track)
        : null;
      const learner = {
        lambdaId,
        name,
        track,
        labsRole,
        labsProject: project.id,
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
 * @param projects
 * @returns
 */
async function buildTeambuildingPayload(
  surveys: ILearnerSurvey[],
  projects: ITeamBuildingProject[]
): Promise<TeambuildingPayload> {
  const payload = {} as TeambuildingPayload;

  // Get necessary info on the existing projects.
  const continuingLearners = await getContinuingLearners(projects);

  // Merge everything together.
  let learners = mergeObjectArrays("lambdaId", [
    surveys,
    continuingLearners,
  ]) as Record<string, unknown>[];

  // Filter out incoming learners who didn't fill out the survey (no existing
  // Labs Project and no "gitExpertise" field.
  learners = learners.filter((x) => x.gitExpertise || x.labsProject);

  // Make sure all desired ILearnerLabsApplication fields are present for each learner.
  learners = learners.map((x) => ({
    lambdaId: x.lambdaId,
    // canvasUserId: x.canvasUserId || null,
    name: x.name || null,
    // track: x.track || null,
    track: (x.track === "WEB" ? "Web" : x.track) || null,
    // labsProject: x.labsProject || null,
    labsProject: x.labsProject || "",
    gitExpertise: x.gitExpertise || null,
    dockerExpertise: x.dockerExpertise || null,
    playByEar: x.playByEar || null,
    detailOriented: x.detailOriented || null,
    speakUpInDiscussions: x.speakUpInDiscussions || null,
    soloOrSocial: x.soloOrSocial ? (x.soloOrSocial as string)[0] : null,
    meaningOrValue: x.meaningOrValue ? (x.meaningOrValue as string)[0] : null,
    feelsRightOrMakesSense: x.feelsRightOrMakesSense
      ? (x.feelsRightOrMakesSense as string)[0]
      : null,
    favoriteOrCollect: x.favoriteOrCollect
      ? (x.favoriteOrCollect as string)[0]
      : null,
    tpmSkill1: x.tpmSkill1 ? (x.tpmSkill1 as string)[0] : null,
    tpmSkill2: x.tpmSkill2 ? (x.tpmSkill2 as string)[0] : null,
    tpmSkill3: x.tpmSkill3 ? (x.tpmSkill3 as string)[0] : null,
    tpmInterest1: x.tpmInterest1 || 0,
    tpmInterest2: x.tpmInterest2 || 0,
    tpmInterest3: x.tpmInterest3 || 0,
    tpmInterest4: x.tpmInterest4 || 0,
    uxInterest1: x.uxInterest1 || 0,
    uxInterest2: x.uxInterest2 || 0,
    frontendInterest1: x.frontendInterest1 || 0,
    frontendInterest2: x.frontendInterest2 || 0,
    backendInterest1: x.backendInterest1 || 0,
    backendInterest2: x.backendInterest2 || 0,
    dataEngInterest1: x.dataEngInterest1 || 0,
    dataEngInterest2: x.dataEngInterest2 || 0,
    dataEngInterest3: x.dataEngInterest3 || 0,
    mlEngInterest1: x.mlEngInterest1 || 0,
    mlEngInterest2: x.mlEngInterest2 || 0,
    mlEngInterest3: x.mlEngInterest3 || 0,
    mlOpsInterest1: x.mlOpsInterest1 || 0,
    mlOpsInterest2: x.mlOpsInterest2 || 0,
    mlOpsInterest3: x.mlOpsInterest3 || 0,
  }));

  payload.learners = learners as unknown as ILearnerLabsApplication[];
  payload.projects = projects;

  return payload;
}

/**
 * Process teambuilding for a given cohort. See /docs/teambuilding.md
 *
 * Relies on the cohort view already having been created in "Labs - Projects",
 * including each project row with any continuing learners already added.
 *
 *   - Get existing teams from Airtable
 *   - Get surveys from Airtable
 *   - POST one JSON body to DS SortingHat in "tidy" format
 *   - TODO: Write teams to "Labs - Projects" table in SMT
 *
 * @param cohort
 * @returns
 */
export async function processTeambuilding(
  cohort: string
): Promise<TeambuildingOutput | null> {
  // Get this cohort's set of projects from Airtable.
  const projects: ITeamBuildingProject[] = parseProjects(
    await projectsDao.getCohort(cohort)
  );

  // Get this cohort's surveys from Airtable.
  const surveys: ILearnerSurvey[] = await parseSurveys(
    await surveyDao.getCohort(cohort)
  );

  // Merge the surveys and projects.
  const payload = await buildTeambuildingPayload(surveys, projects);

  // Post the teambuilding payload to the SortingHat DS API.
  const output = await sortingHatDao.postBuildTeams(payload, cohort);
  if (!output) {
    return null;
  }

  // Patch the role and team assignments to Airtable.
  const success = await studentDao.patchCohortLabsAssignments(
    cohort,
    output.learners
  );
  if (!success) {
    console.error("Failed to write Labs assignments to SMT.");
  }

  return output;
}
