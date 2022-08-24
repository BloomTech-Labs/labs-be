const express = require("express");
const app = express();
const jsforce = require("jsforce");
const bodyParser = require("body-parser");
require("dotenv").config();

const { SF_LOGIN_URL, SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;

// !Establish connection to SFDC Fullcopy sandbox (v54.0)
const conn = new jsforce.Connection({
  loginUrl: SF_LOGIN_URL,
});

// !Submit login
conn.login(SF_USERNAME, SF_PASSWORD + SF_TOKEN, (err, userInfo) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`👤 SFDC User ID: ${userInfo.id}`);
    console.log(`🏢 SFDC Org ID: ${userInfo.organizationId}`);
    console.log(`🌐 SFDC url: ${SF_LOGIN_URL}\n`);
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// !Get Salesforce details with SOQL query
// SEE WORKBENCH FOR FULLCOPY SCHEMA: https://workbench.developerforce.com/describe.php
app.get("/learners", (req, res) => {
  const sfResult = conn.query(
    // return 100 with both Okta and Github not null
    `SELECT name, email, Okta_Id__c, Github_Handle__c, Slack_Id__c, AccountId
    FROM Contact 
    WHERE Okta_Id__c!=null 
    AND Github_Handle__c!=null 
    LIMIT 100`,

    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        console.log(result.records);
        res.json(result.records);
      }
    }
  );
});

// !STATIC ROUTE: extracting details from SFDC object via SFDC SOQL query
// SEE WORKBENCH FOR FULLCOPY SCHEMA: https://workbench.developerforce.com/describe.php
app.get("/learners/static", (req, res) => {
  conn.query(
    `SELECT name, AccountId, Okta_Id__c, github_handle__c, Slack_Id__c, Full_or_Part_Time__c, Canvas_Student_ID__c FROM Contact WHERE Okta_Id__c='00ua87nvcgEq7PF5l357'`,

    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        // return a (static) learner oktaID if valid, otherwise return Null
        res.json(result.records[0]);

        // remove quotation mark
        const learnerOktaId = result.records[0].AccountId.replace(
          /['"']+/g,
          ""
        );
        console.log(`🧠 (STATIC) Learner OktaID: ${learnerOktaId}`);

        // strip out github handle from the full github URL
        // ex: https://github.com/%handle%
        const learnerGithubHandle = result.records[0].Github_Handle__c.replace(
          /['"']+/g,
          ""
        ).replace(/['https://github.com/']+/g, "");
        console.log(
          `🧠 (STATIC) Learner Github handle: ${learnerGithubHandle}\n`
        );
      }
    }
  );
});

// !DYNAMIC ROUTE: extracting details from from SFDC object via SFDC SOQL query
// SEE WORKBENCH FOR FULLCOPY SCHEMA: https://workbench.developerforce.com/describe.php
app.get("/learners/:oktaIdQuery", (req, res) => {
  const oktaIdQuery = req.params.oktaIdQuery;

  // strange string hotfix: quotation marks won't behave with escape characters,
  // QUOTES_oktaQuery adds them into the req.params.oktaIdQuery field and into
  // SFDC SOQL query
  QUOTES__oktaIdQuery = "'" + oktaIdQuery + "'";

  conn.query(
    `SELECT name, AccountId, Okta_Id__c, github_handle__c, Slack_Id__c, Full_or_Part_Time__c, Canvas_Student_ID__c FROM Contact WHERE Okta_Id__c=${QUOTES__oktaIdQuery}`,

    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        // return learner oktaID if valid, otherwise return Null
        res.json(result.records[0]);

        const learnerOktaId = result.records[0].AccountId.replace(
          /['"']+/g,
          ""
        );
        console.log(`🧠 (DYNAMIC) Learner OktaID: ${learnerOktaId}`);
        const learnerGithubHandle = result.records[0].Github_Handle__c.replace(
          /['"']+/g,
          ""
        ).replace(/['https://github.com/']+/g, "");
        console.log(
          `🧠 (DYNAMIC) Learner Github handle: ${learnerGithubHandle}\n`
        );
      }
    }
  );
});

// !Accept incoming Labs application JSON object from POST from the Portal
// This POST route will accept the Labs Application JSON payload from the Portal
// and break it up into a series of variables to capture all key value pairs
app.post("/labsapplication", (req, res, next) => {
  res.send(req.body);

  const learnerOktaId = req.body.oktaId;
  console.log(`\n\nℹ   Learner Okta ID: ${learnerOktaId}`);

  const learnerEmail = req.body.email;
  console.log(`ℹ   Learner email: ${learnerEmail}`);

  const learnerSlackId = req.body.slackId;
  console.log(`ℹ   Learner Slack Id: ${learnerSlackId}\n`);

  //! this is a dumb way of scraping JSON key-value pairs of `labsApplication`
  //! better to iterate over with an array method, etc- in the meantime:
  console.log(`💥💥💥 LABS APPLICATION 💥💥💥`);

  const learnerLabsTimeslot = req.body.labsApplication.labsTimeSlot;
  // format array strings with whitespace trail
  learnerLabsTimeslot.forEach((v, i) => {
    learnerLabsTimeslot[i] = " " + v;
  });
  console.log(`🩻   Learner timeslot preference:${learnerLabsTimeslot}`);

  const learnerGithubHandle = req.body.labsApplication.githubHandle;
  console.log(`🩻   Learner Github handle: ${learnerGithubHandle}`);

  const learnerGitExpertise = req.body.labsApplication.gitExpertise;
  console.log(`🩻   learnerGitExpertise: ${learnerGitExpertise}`);

  const learnerDockerExpertise = req.body.labsApplication.dockerExpertise;
  console.log(`🩻   learnerDockerExpertise: ${learnerDockerExpertise}`);

  const learnerPlayByEar = req.body.labsApplication.playByEar;
  console.log(`🩻   learnerPlayByEar: ${learnerPlayByEar}`);

  const learnerDetailOriented = req.body.labsApplication.detailOriented;
  console.log(`🩻   learnerDetailOriented: ${learnerDetailOriented}`);

  const learnerSpeakUpInDiscussions =
    req.body.labsApplication.speakUpInDiscussions;
  console.log(
    `🩻   learnerSpeakUpInDiscussions: ${learnerSpeakUpInDiscussions}`
  );

  const learnerSoloOrSocial = req.body.labsApplication.soloOrSocial;
  console.log(`🩻   learnerSoloOrSocial: ${learnerSoloOrSocial}`);

  const learnerMeaningOrValue = req.body.labsApplication.meaningOrValue;
  console.log(`🩻   learnerMeaningOrValue: ${learnerMeaningOrValue}`);

  const learnerFeelsRightOrMakesSense =
    req.body.labsApplication.feelsRightOrMakesSense;
  console.log(
    `🩻   learnerFeelsRightOrMakesSense: ${learnerFeelsRightOrMakesSense}`
  );

  const learnerFavoriteOrCollect = req.body.labsApplication.favoriteOrCollect;
  console.log(`🩻   learnerFavoriteOrCollect: ${learnerFavoriteOrCollect}`);

  const learnerTPMSkill1 = req.body.labsApplication.tpmSkill1;
  console.log(`🩻     learnerTPMSkill1: ${learnerTPMSkill1}`);
  const learnerTPMSkill2 = req.body.labsApplication.tpmSkill2;
  console.log(`🩻     learnerTPMSkill2: ${learnerTPMSkill2}`);
  const learnerTPMSkill3 = req.body.labsApplication.tpmSkill3;
  console.log(`🩻     learnerTPMSkill3: ${learnerTPMSkill3}`);

  const learnerTPMInterest1 = req.body.labsApplication.tpmInterest1;
  console.log(`🩻     learnerTPMInterest1: ${learnerTPMInterest1}`);
  const learnerTPMInterest2 = req.body.labsApplication.tpmInterest2;
  console.log(`🩻     learnerTPMInterest2: ${learnerTPMInterest2}`);
  const learnerTPMInterest3 = req.body.labsApplication.tpmInterest3;
  console.log(`🩻     learnerTPMInterest3: ${learnerTPMInterest3}`);
  const learnerTPMInterest4 = req.body.labsApplication.tpmInterest4;
  console.log(`🩻     learnerTPMInterest4: ${learnerTPMInterest4}\n`);

  // Return full Labs application (TODO: this is a string, not the JSobject)
  const learnerLabsApplication = JSON.stringify(req.body.labsApplication);
  console.log(`🆗   Learner Labs Application: \n${learnerLabsApplication}`);
});

//! Check if labs_application exists for a given learner
app.get("/checkIfLabsApplicationExists/:oktaIdQuery", (req, res) => {
  const oktaIdQuery = req.params.oktaIdQuery;

  // strange string hotfix: quotation marks won't behave with escape characters,
  // `QUOTES_oktaQuery` adds them into the req.params.oktaIdQuery field and into
  // SFDC SOQL query
  const QUOTES__oktaIdQuery = "'" + oktaIdQuery + "'";

  //! This SOQL query would be searching for an `Okta_Id__c` on a record
  //! where Labs_Application_Submitted__c equals `true`, until that field
  //! exists on the Contact object, we are looking for a matching okta_Id__c
  conn.query(
    `SELECT Okta_Id__c FROM Contact WHERE Okta_Id__c=${QUOTES__oktaIdQuery}`,
    (err, result) => {
      if (result.records[0].Okta_Id__c === oktaIdQuery) {
        res.send({ oktaId: result.records[0].Okta_Id__c });
        console.log("Labs application exists");
        console.log(result.records[0].Okta_Id__c);
      } else {
        console.log("Labs application does not exist");
        res.send(err);
      }
    }
  );
});

//! single Account create
app.post("/singleAccountCreate", (req, res) => {
  conn
    .sobject("Account")
    .create({ Name: "My Account #1" }, function (err, ret) {
      if (err || !ret.success) {
        return console.error(err, ret);
      }
      console.log("Created record id : " + ret.id);
      res.json("Created record id : " + ret.id);
      // ...
    });
});

// !single Account update
app.patch("/singleAccountUpdate", (req, res) => {
  conn.sobject("Contact").update(
    {
      Id: "0017e00001Z3LUcAAN",
      Name: "Updated Account name",
    },
    function (err, ret) {
      if (err || !ret.success) {
        return console.error(err, ret);
      }
      console.log("Updated Successfully : " + ret.id);
      res.json("Updated Successfully : " + ret.id);
    }
  );
});

//! single Account get
app.get("/singleAccount", (req, res) => {
  const accountId = "0017e00001Z3LUcAAN";
  conn
    .sobject("Account")
    .retrieve("0017e00001Z3LUcAAN", function (err, account) {
      if (err) {
        return console.error(err);
      }
      console.log("Name : " + account.Name);
      res.json(account);
      // ...
    });
});

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Root route");
  console.log("Root route");
});
app.listen(process.env.PORT || 1337, () => {
  console.log(`🎾 Running on port ${process.env.PORT || 1337}`);
});
