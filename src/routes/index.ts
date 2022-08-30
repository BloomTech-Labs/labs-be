/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { postLabsApplication, getLabsApplication } from "./LabsApplication";
import { getActiveLabsLearners } from './LabsContact';

const baseRouter = Router();
baseRouter.get("/labsApplication/:oktaId", getLabsApplication);
baseRouter.post("/labsApplication", postLabsApplication);
baseRouter.get("/labsActiveLearners", getActiveLabsLearners);

export default baseRouter;
