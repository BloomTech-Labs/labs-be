/* istanbul ignore file */
export default {
  expectedAudience: ["api://default", process.env.OKTA_CLIENT_ID as string],
  config: {
    issuer: process.env.OKTA_ISSUER_URL as string,
    clientId: process.env.OKTA_CLIENT_ID as string,
    assertClaims: {
      aud: process.env.OKTA_CLIENT_ID as string,
    },
  },
};
