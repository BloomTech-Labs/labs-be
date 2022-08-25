import jsforce from "jsforce";

export default class SalesforceClient {
    public connection: jsforce.Connection;
    private SF_LOGIN_URL: string;
    private SF_USERNAME: string;
    private SF_PASSWORD: string;
    private SF_TOKEN: string;

  constructor() {
    const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;

    if (!SF_LOGIN_URL) {
      throw new Error("Missing Salesforce Login URL");
    }
    if (!SF_USERNAME) {
      throw new Error("Missing Salesforce username");
    }
    if (!SF_PASSWORD) {
      throw new Error("Missing Salesforce password");
    }
    if (!SF_TOKEN) {
      throw new Error("Missing Salesforce token");
    }

    this.SF_LOGIN_URL = SF_LOGIN_URL;
    this.SF_USERNAME = SF_USERNAME;
    this.SF_PASSWORD = SF_PASSWORD;
    this.SF_TOKEN = SF_TOKEN;

    // Create connection to SFDC Fullcopy sandbox (v54.0)
    this.connection = new jsforce.Connection({
      loginUrl: SF_LOGIN_URL,
    });

    // return (async (): Promise<SalesforceClient> => {
    //     await this.login();
    //     return this;
    // })() as unknown as SalesforceClient;

  }

  public async login(): Promise<jsforce.UserInfo> {
    const connection = this.connection;
    return await connection.login(
        this.SF_USERNAME,
        this.SF_PASSWORD + this.SF_TOKEN,
        (err, userInfo) => {
            if (err) {
                console.error(err);
                //return reject(err);
            } else {
                console.log(`👤 SFDC User ID: ${userInfo.id}`);
                console.log(`🏢 SFDC Org ID: ${userInfo.organizationId}`);
                console.log(`🌐 SFDC url: ${this. SF_LOGIN_URL}\n`);
                //resolve({ connection, userInfo });
            }
        }
    );
  }
}
