# Labs Backend

## Setup

- Create `/.env` [(See sample)](#sample_env)
- `npm install`
- `docker-compose up -d`
- `npm run start:dev`

### Sample `.env` file <a name="sample_env"></a>

```ini
JET_LOGGER_MODE=CONSOLE
JET_LOGGER_FILEPATH=jet-logger.log
JET_LOGGER_TIMESTAMP=TRUE
JET_LOGGER_FORMAT=LINE
OKTA_DOMAIN=auth.lambdalabs.dev
OKTA_ISSUER_URL=https://auth.lambdalabs.dev/oauth2/default
OKTA_CLIENT_ID=<get client id>
CANVAS_ACCESS_TOKEN=<your canvas user dev access token>
AT_API_KEY=<your Airtable API key>
AT_SMT_BASE_ID=<id of smt base>
DATABASE_URL=postgres://docker:docker@localhost:54001/api-dev
```

### Setup postgres

1. Use docker. [Install](https://docs.docker.com/get-docker/) for your platform
   - run: `docker-compose up -d` to start up the postgresql database and pgadmin.
   - Open a browser to [pgadmin](http://localhost:5050/)
     - Login with `pgadmin4@pgadmin.org` and `admin`
     - you should see the Dev server already defined.
     - open the server and enter the password `docker`
   - If you need to start over you will need to delete the folder `> rm -rf ./data/pg` as this is where all of the server data is stored.
     - if the database `api-dev` was not created then start over.
       > When using Docker, you will need to manually create your test database, called `api-test`

## Start locally in dev mode

`npm run start:dev`
