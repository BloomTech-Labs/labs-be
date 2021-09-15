import { IUser } from "@entities/User";

declare module "express" {
  // TODO: This is currently limiting the use of the Request interface to just IUser-compatible objects
  // export interface Request {
  //     body: {
  //         user: IUser | Array <Learner>
  //     };
  // }
}
