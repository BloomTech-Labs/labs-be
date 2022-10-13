import ContactDao from "../ContactDao";
import { Contact } from "@entities/Contact";
import SalesforceClient from "../client";

describe("ContactDao", () => {
  let contactDao: ContactDao;
  beforeAll(async () => {
    const sfclient = new SalesforceClient();
    await sfclient.login().then(() => {
      console.log("sfclient logged in");
    });
    contactDao = new ContactDao(sfclient);
  });

  describe("buildLargeContactFromOktaId", () => {
    it("should return a Contact object with name", async (done) => {
      const oktaId = "00ulnw2y21CVECD76357";
      console.log("oktaId: ", oktaId);
      const response = await contactDao.buildLargeContactFromOktaId(oktaId);
      console.log({ response });
      // console.log({ response["JDS_Track_Enrollments__r"] });
      // expect(response.Id).toBe("0036f00003n6zf9AAA");
      // expect(response.Status__c).toBe("Withdrawn");
      // expect(response.Okta_Id__c).toBe("00ulnw2y21CVECD76357");
      // expect(response.Name).toBe("Labby Labs");r
      // void response.then((contact) => {
      //   expect(contact).toBeInstanceOf(Contact);
      //   expect(contact.oktaId).toBe(oktaId);
      //   expect(contact.name).toBe("Sean");
      //   expect(contact.id).toBe("Maxwell");
      done();
      // });
    });
  });
});
