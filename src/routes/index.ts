/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import authRequired from "../middleware/authRequired";
import { postLabsApplication, getLabsApplication, postTeamAssignment } from "./LabsApplication";

const baseRouter = Router();
baseRouter.get("/labsApplication/:oktaId", getLabsApplication);
baseRouter.post("/labsApplication", postLabsApplication);
// baseRouter.get("/learners", getLearners);
baseRouter.post("/getTeamAssignment", postTeamAssignment);

export default baseRouter;
