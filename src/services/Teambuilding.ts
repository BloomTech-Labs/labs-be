/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/await-thenable */

// =========== ********** DAOS ********** =========== //
import LabsApplicationDao from "@daos/Salesforce/LabsApplicationDao";
import ContactDao from "@daos/Salesforce/ContactDao";
import ProjectDao, { FinalLabsProject } from "@daos/Salesforce/ProjectDao";
import LabsProjectDao from "@daos/Salesforce/LabsProjectDao";
import JDSTrackEnrollmentDao from "@daos/Salesforce/JDSTrackEnrollmentDao";
import SortingHatDao from "@daos/SortingHat/SortingHatDao";
import LabsTimeSlotDao from "@daos/Salesforce/LabsTimeSlotDao";

// =========== ********** ENTITIES ********** =========== //
import TeambuildingPayload, {
  ILabsApplication,
  ILabsApplicationSubmission,
  ITeamBuildingLearner,
  ITeamBuildingProject,
} from "@entities/TeambuildingPayload";
import { parseTrack, Track } from "@entities/TeambuildingOutput";
import { ILabsTimeSlot } from "@entities/LabsTimeSlot";
import TeambuildingOutput, {
  formatTrackForSortingHat,
} from "@entities/TeambuildingOutput";
import LabsProject from "@entities/LabsProject";

// =========== ********** HELPERS ********** =========== //
import {
  buildGitHubUrl,
  getRandomValue
} from "@shared/functions";

// =========== ********** INSTANTIATE DAOS ********** =========== //
const labsApplicationDao = new LabsApplicationDao();
const contactDao = new ContactDao();
const projectDao = new ProjectDao();
const jdsTrackEnrollmentDao = new JDSTrackEnrollmentDao();
const labsTimeSlotDao = new LabsTimeSlotDao();
const sortingHatDao = new SortingHatDao();
const labsProjectDao = new LabsProjectDao();

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
  const labsApplicationResults =
    await labsApplicationDao.getLabsApplicationByOktaId(oktaId);
  return labsApplicationResults;
}

/**
 * Get the first valid time slot for a learner based on their track.
 *
 * @param labsTimeSlots: TimeSlot[]
 */
function getValidTimeSlot(
  labsTimeSlots: ILabsTimeSlot[],
  learnerTimeSlotRankings: string[],
  learnerTrack: Track
): ILabsTimeSlot | null {
  for (const learnerSlot of learnerTimeSlotRankings) {
    const timeSlot =
      labsTimeSlots.find((slot) => slot.shortName === learnerSlot) || {};
    for (const track of timeSlot.tracks || []) {
      if (parseTrack(track) === learnerTrack) {
        return timeSlot;
      }
    }
  }
  return null;
}

/**
 * Build a TeambuildingPayload by merging learners and projects.
 *
 * @param learners
 * @param projects
 * @returns
 */
function buildTeambuildingPayload(
  learners: ITeamBuildingLearner[],
  projects: LabsProject[]
): TeambuildingPayload {
  const payload = {} as TeambuildingPayload;

  // Filter out incoming learners who didn't fill out the survey (no existing
  // Labs Project and no "gitExpertise" field.
  learners = learners.filter((x) => x.gitExpertise || x.labsProject);

  // Make sure all desired ILearnerLabsApplication fields are present for each learner.
  // NOTE: This currently balances or randomizes any missing survey values!
  learners = learners.map((x) => ({
    oktaId: x.oktaId,
    name: x.name || "",
    track: formatTrackForSortingHat(x.track as Track),
    storyPoints: x.storyPoints || 0,
    labsProject: x.labsProject || "",
    labsTimeSlot: x.labsTimeSlot || [""],
    gitHubHandle: x.gitHubHandle || "",
    gitExpertise: x.gitExpertise || 3,
    dockerExpertise: x.dockerExpertise || 3,
    playByEar: x.playByEar || 3,
    detailOriented: x.detailOriented || 3,
    speakUpInDiscussions: x.speakUpInDiscussions || 3,
    soloOrSocial: x.soloOrSocial
      ? x.soloOrSocial[0]
      : (getRandomValue(["A. Solo", "B. Social"]) as string),
    meaningOrValue: x.meaningOrValue
      ? x.meaningOrValue[0]
      : (getRandomValue(["A. Deeper Meaning", "B. Higher Value"]) as string),
    feelsRightOrMakesSense: x.feelsRightOrMakesSense
      ? x.feelsRightOrMakesSense[0]
      : (getRandomValue(["A. It feels right", "B. It makes sense"]) as string),
    favoriteOrCollect: x.favoriteOrCollect
      ? x.favoriteOrCollect[0]
      : (getRandomValue([
          "A. Find your favorite",
          "B. Collect them all",
        ]) as string),
    tpmSkill1: x.tpmSkill1
      ? x.tpmSkill1[0]
      : (getRandomValue(["A", "B", "C", "D"]) as string),
    tpmSkill2: x.tpmSkill2
      ? x.tpmSkill2[0]
      : (getRandomValue(["A", "B"]) as string),
    tpmSkill3: x.tpmSkill3
      ? x.tpmSkill3[0]
      : (getRandomValue(["A", "B", "C", "D"]) as string),
    tpmInterest1: x.tpmInterest1 || (getRandomValue([2, 3]) as number),
    tpmInterest2: x.tpmInterest2 || (getRandomValue([2, 3]) as number),
    tpmInterest3: x.tpmInterest3 || (getRandomValue([2, 3]) as number),
    tpmInterest4: x.tpmInterest4 || (getRandomValue([2, 3]) as number),
  }));

  payload.learners = learners;
  payload.projects = projects as ITeamBuildingProject[];

  return payload;
}

function findTeamAssignmentByLearnerId(
  oktaId: string,
  assignments: TeambuildingOutput
): string | null {
  return (
    assignments.learners.find((learner) => learner.oktaId === oktaId)
      ?.labsProject || null
  );
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
): Promise<FinalLabsProject> {
  const oktaId = labsApplicationSubmission.oktaId;
  const labsApplication = labsApplicationSubmission;
  console.log(labsApplicationSubmission)
  try { 
    // Parse the learner's GitHub handle as a profile URL
    const gitHubUrl = await buildGitHubUrl(labsApplication.gitHubHandle || "");
    // Get the learner's Salesforce Contact ID by their OktaID
    const contactId = await contactDao.getContactIdByOktaId(oktaId);
    // Get the learner's JDS Track Enrollment ID by their Okta Id
    const jdsTrackEnrollmentId =
      await jdsTrackEnrollmentDao.getJdsTrackEnrollmentIdByOktaId(oktaId);
    // Get the learner's track based on their JDS Track Enrollment
    const track = await jdsTrackEnrollmentDao.getTrack(jdsTrackEnrollmentId);
    if (!track) {
      throw new Error("Invalid track");
    }
    // Get all Labs Time Slots from Salesforce
    const labsTimeSlots = await labsTimeSlotDao.getLabsTimeSlots();

    // Get the first valid time slot for the learner based on their track
    
    const sortedTimeSlots = [
      `${labsApplication.timeSlotChoiceMorning}.Morning`,
      `${labsApplication.timeSlotChoiceAfternoon}.Afternoon`,
      `${labsApplication.timeSlotChoiceEvening}.Evening`,
      `${labsApplication.timeSlotChoiceNight}.Night`,
    ].sort().map(s => s.split(".")[1]);
    
    const timeSlot = getValidTimeSlot(
      labsTimeSlots,
      sortedTimeSlots, 
      track
    );
    if (!timeSlot) {
      throw new Error("Invalid time slot");
    }
    // Write the learner's Labs Application responses to Salesforce
    await labsApplicationDao.postLabsApplication(
      jdsTrackEnrollmentId,
      timeSlot,
      labsApplication
    );

    // Write the learner's GitHub URL to their Salesforce Contact
    await contactDao.postGitHubUrl(contactId, gitHubUrl);
    
    // Get all active Labs Projects from Salesforce
    let projects = await projectDao.getActive();

    // Convert the team member IDs on existing projects from Contact IDs to
    // Okta IDs.
    projects = await contactDao.getTeamMemberOktaIds(
      projects as ITeamBuildingProject[]
    );

    // Get all active Labs learners from Salesforce, including their Labs Applications
    const learners = await jdsTrackEnrollmentDao.getLabsActive(track);

    // Build payload for SortingHat
    const learner: ITeamBuildingLearner = {
      oktaId: oktaId,
      name: oktaId,
      track: track,
      storyPoints: 0,
      labsProject: "",
      labsTimeSlot: [timeSlot.shortName || ""],
      gitHubHandle: labsApplication.gitHubHandle || "",
      gitExpertise:
        labsApplication.gitExpertise || (getRandomValue([2, 3]) as number),
      dockerExpertise:
        labsApplication.dockerExpertise || (getRandomValue([2, 3]) as number),
      playByEar:
        labsApplication.playByEar || (getRandomValue([2, 3]) as number),
      detailOriented:
        labsApplication.detailOriented || (getRandomValue([2, 3]) as number),
      speakUpInDiscussions:
        labsApplication.speakUpInDiscussions ||
        (getRandomValue([2, 3]) as number),
      soloOrSocial: labsApplication.soloOrSocial || "",
      meaningOrValue: labsApplication.meaningOrValue || "",
      feelsRightOrMakesSense: labsApplication.feelsRightOrMakesSense || "",
      favoriteOrCollect: labsApplication.favoriteOrCollect || "",
      tpmSkill1: labsApplication.tpmSkill1 || "",
      tpmSkill2: labsApplication.tpmSkill2 || "",
      tpmSkill3: labsApplication.tpmSkill3 || "",
      tpmInterest1:
        labsApplication.tpmInterest1 || (getRandomValue([2, 3]) as number),
      tpmInterest2:
        labsApplication.tpmInterest2 || (getRandomValue([2, 3]) as number),
      tpmInterest3:
        labsApplication.tpmInterest3 || (getRandomValue([2, 3]) as number),
      tpmInterest4:
        labsApplication.tpmInterest4 || (getRandomValue([2, 3]) as number),
    };
    learners.push(learner);
    const payload = buildTeambuildingPayload(learners, projects);
    console.log("💰💰💰 payload 💰💰💰", payload);

    const assignments = await sortingHatDao.postBuildTeams(payload);
    console.log("🪧🪧🪧 assignments 🪧🪧🪧", JSON.stringify(assignments, null, 2));
    if (!assignments) {
      throw new Error("Invalid response from SortingHat");
    }
    const projectName = findTeamAssignmentByLearnerId(oktaId, assignments);
    console.log("🪪 🪪 🪪 projectId 🪪 🪪 🪪", projectName);
    if (!projectName) {
      throw new Error("Invalid project assignment from SortingHat");
    }
    const projectId = await projectDao.getIdByName(projectName)
    // Post the learner's project assignment to Salesforce
    await jdsTrackEnrollmentDao.postProjectAssignment(
      jdsTrackEnrollmentId,
      projectId
    );

    return await labsProjectDao.getProject(projectId);
  } catch (error) {
    return Promise.reject(error);
  }
}

