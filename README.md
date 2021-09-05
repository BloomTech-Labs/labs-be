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
```

## Quick start locally

`npm run start:dev`
