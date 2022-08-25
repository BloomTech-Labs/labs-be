import jsforce from "jsforce";

class SalesforceClient {
    private connection: jsforce.Connection;

    constructor() {
        if (!process.env.SF_LOGIN_URL) {
            throw new Error("Missing Salesforce Login URL");
        }
        if (!process.env.SF_USERNAME) {
            throw new Error("Missing Salesforce username");
        }
        if (!process.env.SF_PASSWORD) {
            throw new Error("Missing Salesforce password");
        }
        if (!process.env.SF_TOKEN) {
            throw new Error("Missing Salesforce token");
        }

        const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;

        // !Establish connection to SFDC Fullcopy sandbox (v54.0)
        this.connection = new jsforce.Connection({
            loginUrl: SF_LOGIN_URL,
        });

        return (async (connection) => {
            await connection.login(
                SF_USERNAME,
                SF_PASSWORD + SF_TOKEN,
                (err, userInfo) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`👤 SFDC User ID: ${userInfo.id}`);
                        console.log(`🏢 SFDC Org ID: ${userInfo.organizationId}`);
                        console.log(`🌐 SFDC url: ${SF_LOGIN_URL}\n`);
                    }
                }
            );
        })(this.connection) as unknown as SalesforceClient;
    }
}
