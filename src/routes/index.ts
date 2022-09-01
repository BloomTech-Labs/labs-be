/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import authRequired from "../middleware/authRequired";
import { postLabsApplication, getLabsApplication } from "./LabsApplication";

const baseRouter = Router();
baseRouter.get("/labsApplication/:oktaId", getLabsApplication);
baseRouter.post("/labsApplication", postLabsApplication);
// baseRouter.get("/learners", getLearners);

export default baseRouter;
