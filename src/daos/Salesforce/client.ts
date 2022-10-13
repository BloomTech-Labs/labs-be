import jsforce from "jsforce";
import logger from "@shared/Logger";

export default class SalesforceClient {
  public connection: jsforce.Connection;

  private sfuser?: jsforce.UserInfo;
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
      version: "54.0",
    });
    // seriously a pain that this has to be called externally
    // void this.login().then(() => {
    //   logger.info("SalesforceClient initialized");
    // });
  }

  public readonly commonQueryHandler = (
    err?: Error,
    result?: jsforce.QueryResult<unknown>
  ): void => {
    if (err) {
      logger.err(`🛑 Query handler Error: \n${err.name} - ${err.message}`);
    } else {
      logger.info(`⚡️ Query handler result: \n${JSON.stringify(result)}`);
    }
  };

  public async login(): Promise<jsforce.UserInfo> {
    let result: Promise<jsforce.UserInfo>;
    // check if user has been memoized
    if (!this.sfuser) {
      result = this.connection
        .login(this.SF_USERNAME, this.SF_PASSWORD + this.SF_TOKEN)
        .then((userInfo) => {
          // memoize the user's info
          this.sfuser = userInfo;
          logger.info(`Logged In
            👤 SFDC User ID: ${userInfo.id}
            🏢 SFDC Org ID: ${userInfo.organizationId}
            📧 SFDC Url: ${this.SF_LOGIN_URL}
          `);
          return userInfo;
        })
        .catch((err) => {
          if (err) {
            logger.err(`🛑 Login Error: \n${err as string}`);
          }
          return Promise.reject(err);
        });
    } else {
      result = Promise.resolve(this.sfuser);
    }
    return result;
  }
}
