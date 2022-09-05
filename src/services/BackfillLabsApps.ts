import SurveyDao from "../daos/Airtable/SurveyDao";
import LabsApplicationDao from "../daos/Salesforce/LabsApplicationDao";
import JDSTrackEnrollmentDao from "@daos/Salesforce/JDSTrackEnrollmentDao";
import { ILabsTimeSlot } from "@entities/LabsTimeSlot";
import { ILabsApplication } from "@entities/TeambuildingPayload";

const labsApplicationDao = new LabsApplicationDao();
const jdsTrackEnrollmentDao = new JDSTrackEnrollmentDao();
const surveyDao = new SurveyDao();

const labsTimeSlots:Record<string, string> = {
  "Morning (Web, DS): 8 – 11 AM Pacific": "a2X6f000000vxXoEAI",
  "Afternoon (Web, BD): 12 – 3 PM Pacific": "a2X6f000000vxXtEAI",
  "Evening (Web, BD): 3 – 6 PM Pacific": "a2X6f000000vxXyEAI",
  "Night (Web, DS): 6 – 9 PM Pacific": "a2X6f000000vxXpEAI",
}

const parseTimeSlots = (
  webSlot: string|undefined,
  dsSlot: string|undefined,
  bdSlot: string|undefined,
) => {
  if (webSlot) {
    return labsTimeSlots[webSlot]
  } else if (dsSlot) {
    return labsTimeSlots[dsSlot]
  } else if (bdSlot) {
    return labsTimeSlots[bdSlot]
  }
}

export const backfillLabsApps = async () => {
  const records = await surveyDao.getAll();
  records.forEach(async (record) => {
    if (!record || !record["fields"] || !record["fields"]["Lambda Id"]) {
      console.log("record does not exist!");
    } else {
    const lambdaId = (record["fields"]["Lambda Id"] as string[])[0]
    const jdsTrackEnrollmentId = await jdsTrackEnrollmentDao.getJdsTrackEnrollmentIdByLambdaId(lambdaId);
    const timeSlot:ILabsTimeSlot = {
        id: parseTimeSlots((record["fields"]["Labs Time Slot (Web)"]) as string, (record["fields"]["Labs Time Slot (DS)"]) as string, (record["fields"]["Labs Time Slot (BD)"]) as string)
    };
    labsApplicationDao.postLabsApplication(
      jdsTrackEnrollmentId,
      timeSlot,
      {
        timeSlotChoice1: parseTimeSlots((record["fields"]["Labs Time Slot (Web)"]) as string, (record["fields"]["Labs Time Slot (DS)"]) as string, (record["fields"]["Labs Time Slot (BD)"]) as string),
        timeSlotChoice2: parseTimeSlots((record["fields"]["Labs Time Slot (Web)"]) as string, (record["fields"]["Labs Time Slot (DS)"]) as string, (record["fields"]["Labs Time Slot (BD)"]) as string),
        timeSlotChoice3: parseTimeSlots((record["fields"]["Labs Time Slot (Web)"]) as string, (record["fields"]["Labs Time Slot (DS)"]) as string, (record["fields"]["Labs Time Slot (BD)"]) as string),
        timeSlotChoice4: parseTimeSlots((record["fields"]["Labs Time Slot (Web)"]) as string, (record["fields"]["Labs Time Slot (DS)"]) as string, (record["fields"]["Labs Time Slot (BD)"]) as string),
        gitHubHandle: record["fields"]["GitHub Handle (Standardized)"],
        gitExpertise: record["fields"]["Git Expertise"],
        dockerExpertise: record["fields"]["Docker Expertise"],
        playByEar: record["fields"]["Do you plan ahead or play it by ear?"],
        detailOriented: record["fields"]["Are you more interested in the big picture or details?"],
        speakUpInDiscussions: record["fields"]["How often do you speak up during group discussions?"],
        soloOrSocial: record["fields"]["What activities do you prefer?"],
        meaningOrValue: record["fields"]["Which do you prefer to seek?"],
        feelsRightOrMakesSense: record["fields"]["Choices are easier when..."],
        favoriteOrCollect: record["fields"]["Which method do you prefer?"],
        tpmSkill1: record["fields"]["TPM Skill 1"],
        tpmSkill2: record["fields"]["TPM Skill 2"],
        tpmSkill3: record["fields"]["TPM Skill 3"],
        tpmInterest1: record["fields"]["TPM Interest 1"],
        tpmInterest2: record["fields"]["TPM Interest 2"],
        tpmInterest3: record["fields"]["TPM Interest 3"],
        tpmInterest4: record["fields"]["TPM Interest 4"],
      } as ILabsApplication
    );
    }
  });
};
