/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/await-thenable */
import { FieldSet, Records } from "airtable";
import LabsApplicationDao from "@daos/Salesforce/LabsApplicationDao";
import ContactDao from "@daos/Salesforce/ContactDao";
import ProjectDao from "@daos/Salesforce/ProjectDao";
import JDSTrackEnrollmentDao from "@daos/Salesforce/JDSTrackEnrollmentDao";
import TeambuildingPayload, {
  ILabsApplication,
  ILabsApplicationSubmission,
  ITeamBuildingProject,
} from "@entities/TeambuildingPayload";
import SortingHatDao from "@daos/SortingHat/SortingHatDao";
import { resolve } from "path";
import { buildGitHubUrl, getRandomValue, mergeObjectArrays } from "@shared/functions";
import LabsTimeSlotDao from "@daos/Salesforce/LabsTimeSlotDao";
import TeambuildingOutput, { Learner } from "@entities/TeambuildingOutput";

const labsApplicationDao = new LabsApplicationDao();
const contactDao = new ContactDao();
const projectDao = new ProjectDao();
const jdsTrackEnrollmentDao = new JDSTrackEnrollmentDao();
const labsTimeSlotDao = new LabsTimeSlotDao();
const sortingHatDao = new SortingHatDao();

/**
 * Get a learner's Labs Application from Salesforce.
 *
 * @param oktaId
 * @returns
 */
export async function getLabsApplicationByOktaId(
  oktaId: string
): Promise<ILabsApplication | null> {
  // Get from Salesforce
  const labsApplicationResults = await labsApplicationDao.getLabsApplicationByOktaId(
    oktaId
  );
  return labsApplicationResults;
}

/**
 * Process an incoming Labs Application:
 * - Parse the learner's GitHub handle as a profile URL
 * - Get the learner's Salesforce ID by their OktaID
 * - Write the learner's Labs Application responses to Salesforce
 * - Write the learner's GitHub URL to their Salesforce Contact
 * - Get all active Labs Projects from Salesforce
 * - Get all active Labs learners from Salesforce, including their Labs Applications
 * - Get the learner's project assignment from SortingHat
 * - Post the learner's project assignment to Salesforce
 *
 * @param labsApplicationSubmission: ILabsApplicationSubmission
 * @returns
 */
export async function processLabsApplication(
  labsApplicationSubmission: ILabsApplicationSubmission
): Promise<void> {
  const oktaId = labsApplicationSubmission.oktaId;
  const labsApplication = labsApplicationSubmission.labsApplication;
  try {
    // Parse the learner's GitHub handle as a profile URL
    const gitHubUrl = await buildGitHubUrl(labsApplication.gitHubHandle || "");
    // Get the learner's Salesforce ID by their OktaID
    const salesforceId = await contactDao.getSalesforceIdByOktaId(oktaId);
    // Get the learner's JDS Track Enrollment ID by their Okta Id
    const jdsTrackEnrollmentId = await jdsTrackEnrollmentDao.getJdsTrackEnrollmentIdByOktaId(oktaId);
    // Get the learner's track based on their JDS Track Enrollment
    const track = await jdsTrackEnrollmentDao.getTrack(jdsTrackEnrollmentId);
    // Get all Labs Time Slots from Salesforce
    const labsTimeSlots = await labsTimeSlotDao.getLabsTimeSlots();
    // Write the learner's Labs Application responses to Salesforce
    await labsApplicationDao.postLabsApplication(jdsTrackEnrollmentId, labsTimeSlots, labsApplication);

    /*
    // Write the learner's GitHub URL to their Salesforce Contact
    await contactDao.postGitHubUrl(salesforceId, gitHubUrl);
    // Get all active Labs Projects from Salesforce
    const projects = await projectDao.getActive();
    // Get all active Labs learners from Salesforce, including their Labs Applications
    const learners = await jdsTrackEnrollmentDao.getLabsActive();

    // builds out payload for teams // probably needs to be async
    // const formatPayload = buildTeambuildingPayload(projects, learners);

    // const assignments = await sortingHatDao.postBuildTeams(formatPayload);
    // const projectId = findTeamAssignmentByLearnerId(, assignments);

    // "lambdaId": "KCB43PQ3Z4N4o248",

    // need to know the input for the req.body() into getTeamAssignment
    // Get the learner's project assignment from SortingHat
    // TODO
    // - Understand required payload shape for SortingHat
    // - Mock the payload for SortingHat for this function 
    // - Get and return a valid response from SortingHat for the mock payload
    // - Replace the mock with a real input
    // Post the learner's project assignment to Salesforce
    // TODO
    // Post the learner's project assignment to Salesforce
    //await jdsTrackEnrollmentDao.postProjectAssignment(jdsTrackEnrollmentId, projectId);

    */


  } catch (error) {
    return Promise.reject(error);//str labsProject: 'Test Product - a"
  }
}

function findTeamAssignmentByLearnerId(
  learnerId: string,
  assignments: TeambuildingOutput
) : string | null {
  return assignments.learners.find(learner => learner.lambdaId === learnerId)?.labsProject || null;
}
    // {
    //   "lambdaId": "KpM2l67553U1G2ze",
    //   "name": "Aiden Martinez",
    //   "track": "DS",
    //   "storyPoints": 7,
    //   "labsProject": "Test Product - A",
    //   "gitExpertise": 0,
    //   "dockerExpertise": 0,
    //   "playByEar": 0,
    //   "detailOriented": 0,
    //   "speakUpInDiscussions": 0,
    //   "soloOrSocial": "",
    //   "meaningOrValue": "",
    //   "feelsRightOrMakesSense": "",
    //   "favoriteOrCollect": "",
    //   "tpmSkill1": "B",
    //   "tpmSkill2": "B",
    //   "tpmSkill3": "C",
    //   "tpmInterest1": 2,
    //   "tpmInterest2": 1,
    //   "tpmInterest3": 2,
    //   "tpmInterest4": 2,
    //   "uxInterest1": 3,
    //   "uxInterest2": 2,
    //   "frontendInterest1": 1,
    //   "frontendInterest2": 2,
    //   "backendInterest1": 2,
    //   "backendInterest2": 1,
    //   "dataEngInterest1": 0,
    //   "dataEngInterest2": 0,
    //   "dataEngInterest3": 0,
    //   "mlEngInterest1": 0,
    //   "mlEngInterest2": 0,
    //   "mlEngInterest3": 0,
    //   "mlOpsInterest1": 0,
    //   "mlOpsInterest2": 0,
    //   "mlOpsInterest3": 0,
    //   "tpmSkillRank": 1,
    //   "tpmInterestRank": 0.4375,
    //   "uxInterestRank": 0.625,
    //   "frontendInterestRank": 0.375,
    //   "backendInterestRank": 0.375,
    //   "dataEngInterestRank": 0,
    //   "mlEngInterestRank": 0,
    //   "mlOpsInterestRank": 0
    // }





/**
 * Given an array of raw teambuilding survey results, parse it into an array of
 * ILearnerSurveys.
 *
 * @param surveys
 * @returns
 */
// async function parseSurveys(
//   surveys: Records<FieldSet>
// ): Promise<ILearnerSurvey[]> {
//   const learnerSurveys = await Promise.all(
//     surveys.map((survey) => {
//       const record = survey.fields;
//       const learnerSurvey: ILearnerSurvey = {
//         name: (record["Student Name"] as string[])[0],
//         lambdaId: (record["Lambda ID"] as string[])[0],
//         smtId: record["SMT ID"] as string,
//         track: parseTrack(record["Track"] as string) as Track,
//         gitExpertise: record["Git Expertise"] as number,
//         dockerExpertise: record["Docker Expertise"] as number,
//         playByEar: record["Do you plan ahead or play it by ear?"] as number,
//         detailOriented: record[
//           "Are you more interested in the big picture or details?"
//         ] as number,
//         speakUpInDiscussions: record[
//           "How often do you speak up during group discussions?"
//         ] as number,
//         soloOrSocial: record["What activities do you prefer?"] as string,
//         meaningOrValue: record["Which do you prefer to seek?"] as string,
//         feelsRightOrMakesSense: record["Choices are easier when..."] as string,
//         favoriteOrCollect: record["Which method do you prefer?"] as string,
//         tpmSkill1: record["TPM Skill 1"] as string,
//         tpmSkill2: record["TPM Skill 2"] as string,
//         tpmSkill3: record["TPM Skill 3"] as string,
//         tpmInterest1: record["TPM Interest 1"] as number,
//         tpmInterest2: record["TPM Interest 2"] as number,
//         tpmInterest3: record["TPM Interest 3"] as number,
//         tpmInterest4: record["TPM Interest 4"] as number,
//         uxInterest1: record["UX Interest 1"] as number,
//         uxInterest2: record["UX Interest 2"] as number,
//         frontendInterest1: record["Frontend Interest 1"] as number,
//         frontendInterest2: record["Frontend Interest 2"] as number,
//         backendInterest1: record["Backend Interest 1"] as number,
//         backendInterest2: record["Backend Interest 2"] as number,
//         dataEngInterest1: record["Data Engineer Interest 1"] as number,
//         dataEngInterest2: record["Data Engineer Interest 2"] as number,
//         dataEngInterest3: record["Data Engineer Interest 3"] as number,
//         mlEngInterest1: record[
//           "Machine Learning Engineer Interest 1"
//         ] as number,
//         mlEngInterest2: record[
//           "Machine Learning Engineer Interest 2"
//         ] as number,
//         mlEngInterest3: record[
//           "Machine Learning Engineer Interest 3"
//         ] as number,
//         mlOpsInterest1: record["ML Ops Interest 1"] as number,
//         mlOpsInterest2: record["ML Ops Interest 2"] as number,
//         mlOpsInterest3: record["ML Ops Interest 3"] as number,
//       };
//       return learnerSurvey;
//     })
//   );

//   return learnerSurveys;
// }

/**
 * Given an array of raw project results, parse it into an array of
 * ITeamBuildingProjects.
 *
 * @param projects
 * @returns
 */
// function parseProjects(projects: Records<FieldSet>): ITeamBuildingProject[] {
//   return projects.map((x) => {
//     const record = x.fields;
//     const project: ITeamBuildingProject = {
//       id: record["Name"] as string,
//       product: (record["Product Name"] as string[])[0],
//       teamCode: record["Team Code"] as string,
//       tracks: (() => {
//         const tracks = record["Tracks"] as string[];
//         return tracks.map((track) =>
//           parseTrack(track) === Track.WEB ? "Web" : parseTrack(track)
//         );
//       })(),
//       releaseManager: (record["Release Manager"] as string[])[0],
//       teamMemberSmtIds: (record["Team Members"] || []) as string[],
//     };
//     return project;
//   });
// }

/**
 * Given an array of ITeamBuildingProjects, get info on the continuing learners for
 * each project from Airtable.
 *
 * @param projects
 * @returns
 */
// async function getContinuingLearners(
//   projects: ITeamBuildingProject[]
// ): Promise<Record<string, unknown>[]> {
//   const continuingLearners = [] as Record<string, unknown>[];
//   console.log("CONTINUING LEARNERS:")
//   for (const project of projects) {
//     console.log("");
//     console.log(project.id);
//     console.log("----------------");
//     // For each team member on the project, get their relevant properties.
//     for (const smtId of project.teamMemberSmtIds || []) {
//       const student = await studentDao.getByRecordId(smtId);
//       if (!student) {
//         continue;
//       }
//       const lambdaId = (student["Lambda ID"] as string[])[0];
//       const name = student["Name"] as string;
//       const survey = await surveyDao.getOne(lambdaId);
//       const trackRecordId = student["Course"] as string;
//       console.log(name, trackRecordId);
//       if (!trackRecordId) {
//         continue;
//       }
//       const track = await studentDao.getTrackByTrackRecordId(trackRecordId);

//       const learner = {
//         lambdaId,
//         name,
//         track,
//         labsProject: project.id,
//         survey,
//       };
//       continuingLearners.push(learner);
//     }
//   }
//   console.log("");
//   return continuingLearners;
// }

/**
 * Build a TeambuildingPayload by merging surveys and projects.
 *
 * @param surveys
 * @param projects
 * @returns
 */
function buildTeambuildingPayload(
  learners: Record<string, unknown>[], // TODO: NEEDS REAL TYPE
  projects: ITeamBuildingProject[]
): TeambuildingPayload {
  const payload = {} as TeambuildingPayload;

  // Merge everything together.
  learners = mergeObjectArrays("lambdaId", [
    learners,
    // surveys,
    projects,
  ]) as Record<string, unknown>[];

  // Filter out incoming learners who didn't fill out the survey (no existing
  // Labs Project and no "gitExpertise" field.
  learners = learners.filter((x) => x.gitExpertise || x.labsProject);

  // Make sure all desired ILearnerLabsApplication fields are present for each learner.
  // NOTE: This currently balances or randomizes any missing survey values!
  learners = learners.map((x) => ({
    lambdaId: x.lambdaId,
    // canvasUserId: x.canvasUserId || null,
    name: x.name || null,
    track: (x.track === "WEB" ? "Web" : x.track) || null,
    labsProject: x.labsProject || "",
    gitExpertise: x.gitExpertise || 3,
    dockerExpertise: x.dockerExpertise || 3,
    playByEar: x.playByEar || 3,
    detailOriented: x.detailOriented || 3,
    speakUpInDiscussions: x.speakUpInDiscussions || 3,
    soloOrSocial: x.soloOrSocial ? (x.soloOrSocial as string)[0] : getRandomValue(
      ["A. Solo", "B. Social"]
    ),
    meaningOrValue: x.meaningOrValue ? (x.meaningOrValue as string)[0] : getRandomValue(
      ["A. Deeper Meaning", "B. Higher Value"]
    ),
    feelsRightOrMakesSense: x.feelsRightOrMakesSense
      ? (x.feelsRightOrMakesSense as string)[0]
      : getRandomValue(
          ["A. It feels right", "B. It makes sense"]
        ),
    favoriteOrCollect: x.favoriteOrCollect
      ? (x.favoriteOrCollect as string)[0]
      : getRandomValue(
          ["A. Find your favorite", "B. Collect them all"]
        ),
    tpmSkill1: x.tpmSkill1 ? (x.tpmSkill1 as string)[0] : getRandomValue(
      ["A", "B", "C", "D"]
    ),
    tpmSkill2: x.tpmSkill2 ? (x.tpmSkill2 as string)[0] : getRandomValue(
      ["A", "B"]
    ),
    tpmSkill3: x.tpmSkill3 ? (x.tpmSkill3 as string)[0] : getRandomValue(
      ["A", "B", "C", "D"]
    ),
    tpmInterest1: x.tpmInterest1 || getRandomValue([2,3]),
    tpmInterest2: x.tpmInterest2 || getRandomValue([2,3]),
    tpmInterest3: x.tpmInterest3 || getRandomValue([2,3]),
    tpmInterest4: x.tpmInterest4 || getRandomValue([2,3]),
    uxInterest1: x.uxInterest1 || getRandomValue([2,3]),
    uxInterest2: x.uxInterest2 || getRandomValue([2,3]),
    frontendInterest1: x.frontendInterest1 || getRandomValue([2,3]),
    frontendInterest2: x.frontendInterest2 || getRandomValue([2,3]),
    backendInterest1: x.backendInterest1 || getRandomValue([2,3]),
    backendInterest2: x.backendInterest2 || getRandomValue([2,3]),
    dataEngInterest1: x.dataEngInterest1 || getRandomValue([2,3]),
    dataEngInterest2: x.dataEngInterest2 || getRandomValue([2,3]),
    dataEngInterest3: x.dataEngInterest3 || getRandomValue([2,3]),
    mlEngInterest1: x.mlEngInterest1 || getRandomValue([2,3]),
    mlEngInterest2: x.mlEngInterest2 || getRandomValue([2,3]),
    mlEngInterest3: x.mlEngInterest3 || getRandomValue([2,3]),
    mlOpsInterest1: x.mlOpsInterest1 || getRandomValue([2,3]),
    mlOpsInterest2: x.mlOpsInterest2 || getRandomValue([2,3]),
    mlOpsInterest3: x.mlOpsInterest3 || getRandomValue([2,3]),
  }));

  payload.learners = learners as unknown as ILabsApplication[];
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
 *   - Get incoming cohort surveys from Airtable
 *   - For continuing learners, check if we have valid values from an old survey.
 *     If not, fill in random valid values for any missing items.
 *   - POST one JSON body to DS SortingHat in "tidy" format
 *   - Write teams to "Labs - Projects" table in SMT
 *
 * @param cohort
 * @returns
 */
// export async function processTeambuilding(
//   cohort: string
// ): Promise<TeambuildingOutput | null> {
//   // Get this cohort's set of projects from Airtable.
//   const projects: ITeamBuildingProject[] = parseProjects(
//     await projectsDao.getCohort(cohort)
//   );

//   // Get this cohort's surveys from Airtable.
//   const surveys: ILearnerSurvey[] = await parseSurveys(
//     await surveyDao.getCohort(cohort)
//   );

//   // Get any continuing learners and their surveys, if any.
//   const continuingLearners = await getContinuingLearners(projects);
//   const continuingSurveys: ILearnerSurvey[] = await parseSurveys(
//     (continuingLearners
//       .filter(learner => learner.survey)
//       .map(learner => learner.survey)
//     ) as Records<FieldSet>
//   );

//   // Merge the surveys and projects.
//   const payload = buildTeambuildingPayload (
//     continuingLearners,
//     [...continuingSurveys, ...surveys],
//     projects
//   );

//   // Post the teambuilding payload to the SortingHat DS API.
//   const output = await sortingHatDao.postBuildTeams(payload, cohort);
//   if (!output) {
//     return null;
//   }

//   console.log("BUILT TEAMS:");
//   for (const project of output.projects) {
//     console.log("");
//     console.log(project.id);
//     console.log("--------------");
//     for (const learner of output.learners) {
//       if (learner.labsProject === project.id) {
//         console.log(learner.name, ", ", learner.track);
//       }
//     }
//   }
//   console.log("");
//   console.log(`Total learner count: ${output.learners.length}`);

//   // Patch the role and team assignments to Airtable.
//   const success = await studentDao.patchCohortLabsAssignments(
//     cohort,
//     output.learners
//   );
//   if (!success) {
//     console.error("Failed to write Labs assignments to SMT.");
//   }

//   return output;
// }
