declare global {
  namespace Express {
    export interface Request {
      currentUser?: import("@entities/User").IUser | undefined;
    }
  }
}
