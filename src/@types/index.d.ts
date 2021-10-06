// importing Express from the a-typical module in order to get the
// express-serve-static-core namespace into this module. Nothing else
// worked from our friend on the internet.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Express } from "express-serve-static-core";

declare module "express-serve-static-core" {
  export interface Request {
    currentUser?: import("@entities/User").IUser | undefined;
  }
}
