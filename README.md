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
SORTING_HAT_URL=<SortingHat base URL>
```

## Start locally in dev mode

`npm run start:dev`
