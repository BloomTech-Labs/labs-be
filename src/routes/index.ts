/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import authRequired from "../middleware/authRequired";
import { postLabsApplication } from "./LabsApplication";

const baseRouter = Router();
// baseRouter.get("/labsApplication", getLabsApplication);
baseRouter.post("/labsApplication", postLabsApplication);

export default baseRouter;
