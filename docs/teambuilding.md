# Teambuilding API Contract

## BE

- Pre-step:
  - Dump everyone from "Labs - Projects" table who graduated
  - Clone "Labs - Projects" table as a backup ("Labs FT - 09/27/21")
- Get new Labs Applications from Canvas
  - Role Quiz Scores
  - Role Rankings from Final Application quiz (Web + DS)
- Get surveys from Airtable
- Get existing teams from Airtable
- POST one JSON body to DS SortingHat in "tidy" format
- Write teams to "Labs - Projects" table

```Typescript
{
  "learners": [
    {
      "lambdaId": string,
      "name": string,
      "track": Track // DS, Web
      "labsRole": string | null, // If null, it's a new learner
      "labsProject": string | null, // e.g. "Human Rights First Asylum Analysis - A" – needs to correspond to project id
      "roleQuizScores": {
        "Technical Project Manager": number,
        "Data Engineer": number,
        "UX Engineer": number
      },
      "roleRankings": {
        "Technical Project Manager": number,
        "Data Engineer": number,
        "UX Engineer": number,
        "Machine Learning Engineer": number
      },
      "gitExpertise": number,
      "dockerExpertise": number,
      "playByEar": number,
      "detailOriented": number,
      "speakUpInDiscussions": number,
      "diversityConsent": boolean,
      "genderIdentity": string,
      "ethnicities": string[],
      "dontWorkWith": string[], // array of Lambda ID strings
    }
  ],
  "projects": [
    {
      "id": string, // e.g. "Human Rights First Asylum Analysis - A" - needs to correspond to learner.labsProject
      "product": string,
      "teamCode": string, // e.g. A
      "tracks": [
        "Web"
      ],
      "releaseManager": string, // ?
    }
  ]
}
```
