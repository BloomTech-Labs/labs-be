import * as express from "express";
import OktaJwtVerifier, { JwtClaims } from "@okta/jwt-verifier";
import oktaConfig from "@shared/oktaConfig";
import { IUser } from "@entities/User";
import UserDao from "@daos/User/UserDao";
import Logger from "@shared/Logger";
import logger from "@shared/Logger";

const makeUserFromClaims = (claims: JwtClaims): IUser => {
  return {
    email: claims.email as string,
    name: claims.name as string,
    id: claims.sub,
  };
};

/**
 * A simple middleware that asserts valid Okta idToken and sends 401 responses
 * if the token is not present or fails validation. If the token is valid its
 * contents are attached to req.profile
 */
const authRequired = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  void (async () => {
    try {
      const authHeader = req.headers.authorization || "";
      const jwtIdToken = authHeader.split(" ")[1];
      // logger.info(`JWT: ${jwtIdToken}`);
      if (!jwtIdToken)
        throw new Error("Expected a Bearer Token of idToken type JWT");

      const oktaJwtVerifier = new OktaJwtVerifier(oktaConfig.config);

      const { claims } = await oktaJwtVerifier.verifyAccessToken(
        jwtIdToken,
        oktaConfig.expectedAudience
      );
      const user = makeUserFromClaims(claims);
      // find or create profile
      const userDao = new UserDao();
      const newUser = await userDao.findOrCreate(user);
      // add profile to request object
      if (newUser) {
        req.currentUser = newUser;
      } else {
        throw new Error("Unable to process idToken, may be invalid");
      }
      next();
    } catch (err) {
      Logger.err(err);
      next({ status: 401, error: err });
    }
  })();
};

export default authRequired;
