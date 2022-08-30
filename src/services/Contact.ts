import ContactDao from "@daos/Salesforce/ContactDao";
import {
  ILabsActiveLearners,
} from "@entities/ContactLearners";

const contactDao = new ContactDao();

/**
 * Get all active learners Salesforce.
 *
 * @returns
 */
export async function getListOfLabsLearners(): Promise<ILabsActiveLearners | null> {
  // Get from Salesforce
  const labsApplicationResults = await contactDao.getAllActiveLabsLearners();
  return labsApplicationResults;
}