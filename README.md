# Labs Backend

## Setup

- Create `/.env` [(See sample)](#sample_env)
- `npm install`

### Sample `.env` file <a name="sample_env"></a>

```ini
JET_LOGGER_MODE=CONSOLE
JET_LOGGER_FILEPATH=jet-logger.log
JET_LOGGER_TIMESTAMP=TRUE
JET_LOGGER_FORMAT=LINE
AUTH_JWKS_URI=https://dev-acwosrae.us.auth0.com/.well-known/jwks.json
AUTH_JWT_AUDIENCE=https://labby/api
AUTH_JWT_ISSUER=https://dev-acwosrae.us.auth0.com/
CANVAS_ACCESS_TOKEN=<your canvas user dev access token>
AT_API_KEY=<your Airtable API key>
DATABASE_URL=<connection string for postgres database using the knex url format>
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

## Quick start locally

`npm run start:dev`
