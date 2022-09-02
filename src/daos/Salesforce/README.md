# Labby BE SFDC interface

### **Env variables:**

- `SF_LOGIN_URL`: `https://test.salesforce.com`
- `SF_USERNAME`: `api-user@lambdaschool.com.fullcopy`
- `SF_PASSWORD`: `vmjadpk300Jas05jR56r`
- `SF_TOKEN`: `Z5F4d8jsGOSTTelniONwkexj`

> **Note:** you can replace the `SF_LOGIN_URL` value with `https://login.salesforce.com` and remove `.fullcopy` from the `SF_USERNAME` to switch from the SFDC sandbox to production.

---

## Endpoints

- **_URL:_** '`/`'
  \
   **_METHOD:_** `GET`
  \
   **_Description_**: root route
- **_URL:_** '`/learners`'
  \
   **_METHOD:_** `GET`
  \
   **_Description_**: Sends back 100 active learners with both a `Okta_Id__c` and `Github_handle__c`
- **_URL:_** '`/learners/static`'
  \
   **_METHOD:_** `GET`
  \
   **_Description_**: Sends back a learner Contact object via a static `Okta_Id__c`
- **_URL:_** '`/learners/:oktaId`'
  \
   **_METHOD:_** `GET`
  \
   **_Description_**: Sends back a learner Contact object via a valid `oktaId`
- **_URL:_** '`/labsApplication`'
  \
  **_METHOD:_** `POST`
  \
  **_Description_**: Accepts a Labs application JSON object, as per the API contract (see `labsApplicationObjectShape.json` for payload)
- **_URL:_** '`/checkIfLabsApplicationExists/:oktaId`'
  \
  **_METHOD:_** `GET`
  \
  **_Description_**: Returns with a JSON object with the `oktaId` if the labs application has been submitted by the learner via the `:oktaId` query string- otherwise returns `null`

- **_URL:_** '`/singleAccountCreate`'
  \
  **_METHOD:_** `POST`
  \
  **_Description_**: Creates a new `Account` object and returns the `id`

- **_URL:_** '`/singleAccountCreate`'
  \
  **_METHOD:_** `PATCH`
  \
  **_Description_**: Updates a `Account` object and returns the `id`

- **_URL:_** '`/singleAccountCreate/:id`'
  \
  **_METHOD:_** `POST`
  \
  **_Description_**: Creates a new `Account` object where `id` = `:id`- returns the `id`
