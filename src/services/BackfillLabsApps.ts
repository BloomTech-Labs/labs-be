import SurveyDao from "../daos/Airtable/SurveyDao";
import LabsApplicationDao from "../daos/Salesforce/LabsApplicationDao";
import JDSTrackEnrollmentDao from "@daos/Salesforce/JDSTrackEnrollmentDao";

const labsApplicationDao = new LabsApplicationDao();
const jdsTrackEnrollmentDao = new JDSTrackEnrollmentDao();
const surveyDao = new SurveyDao();

export const backfillLabsApps = async () => {
  const records = await surveyDao.getAll();
  records.forEach(async (record) => {
    const jdsTrackEnrollmentId =
      await jdsTrackEnrollmentDao.getJdsTrackEnrollmentIdByLambdaId(
        "sample Lambda ID"
      );
    labsApplicationDao.postLabsApplication(
      jdsTrackEnrollmentId, // jdsTrackEnrollmentId
      {}, // labsTimeSlot
      {} // labsApplication
    );
  });
};
