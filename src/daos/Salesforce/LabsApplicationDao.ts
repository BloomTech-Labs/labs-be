import SalesforceClient from "./client";

export default class LabsApplicationDao {
  private client: SalesforceClient | null;

  constructor() {
    this.client = null;
    return (async (): Promise<LabsApplicationDao> => {
      // The SalesforceClient must be instantiated with 'await' because it contains an
      // IIFE that logs in the client.
      // eslint-disable-next-line @typescript-eslint/await-thenable
      this.client = await new SalesforceClient();
      return this;
    })() as unknown as LabsApplicationDao;
  }

  
}
