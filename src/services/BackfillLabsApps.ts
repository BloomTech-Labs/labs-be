import SurveyDao from "../daos/Airtable/SurveyDao";
import LabsApplicationDao from "../daos/Salesforce/LabsApplicationDao";
import JDSTrackEnrollmentDao from "@daos/Salesforce/JDSTrackEnrollmentDao";

const labsApplicationDao = new LabsApplicationDao();
const jdsTrackEnrollmentDao = new JDSTrackEnrollmentDao();
const surveyDao = new SurveyDao();

export const backfillLabsApps = async () => {
  const records = await surveyDao.getAll();
  records.forEach(async (record) => {
    const lambdaId = record["fields"]["Lambda Id"][0]? record["fields"]["Lambda Id"][0]: ""
    const jdsTrackEnrollmentId = await jdsTrackEnrollmentDao.getJdsTrackEnrollmentIdByLambdaId(lambdaId);
    labsApplicationDao.postLabsApplication(
      jdsTrackEnrollmentId,
      {
        id: "",
        labsProducts: [],
        name: "",
        shortName: "",
        ownerId: "",
        tracks: []
      },
      {
        timeSlotChoice1: "",
        timeSlotChoice2: "",
        timeSlotChoice3: "",
        timeSlotChoice4: "",
        gitHubHandle: "",
        gitExpertise: 0,
        dockerExpertise: 0,
        playByEar: 0,
        detailOriented: 0,
        speakUpInDiscussions: 0,
        soloOrSocial: "",
        meaningOrValue: "",
        feelsRightOrMakesSense: "",
        favoriteOrCollect: "",
        tpmSkill1: "",
        tpmSkill2: "",
        tpmSkill3: "",
        tpmInterest1: 0,
        tpmInterest2: 0,
        tpmInterest3: 0,
        tpmInterest4: 0,
        uxInterest1: 0,
        uxInterest2: 0,
        frontendInterest1: 0,
        frontendInterest2: 0,
        backendInterest1: 0,
        backendInterest2: 0,
        dataEngInterest1: 0,
        dataEngInterest2: 0,
        dataEngInterest3: 0,
        mlEngInterest1: 0,
        mlEngInterest2: 0,
        mlEngInterest3: 0,
        mlOpsInterest1: 0,
        mlOpsInterest2: 0,
        mlOpsInterest3: 0,
      }
    );
  });
};
