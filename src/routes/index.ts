/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from "./Users";
import { getAllVars } from "./env";
import {
  getAllAssignments,
  getAllRequiredCoursesCompleted,
  getAssignment,
  getAssignmentSubmissions,
  getCourseCompleted,
  getCourseModuleCompletion,
  getCourseModules,
  getModule,
  getModuleCompletion,
} from "./Canvas";
import {
  getAllSurveys,
  getCohortSurveys,
  getAllStudents,
  getCohortStudents,
  getStudentByEmail,
} from "./Airtable";
import { putEventAttendance } from "./Attendance";
import authRequired from "../middleware/authRequired";

const userRouter = Router();
userRouter.get("/all", authRequired, getAllUsers);
userRouter.post("/add", addOneUser);
userRouter.put("/update", updateOneUser);
userRouter.delete("/delete/:id", deleteOneUser);

const envRouter = Router();
envRouter.get("/all", getAllVars);

const canvasRouter = Router();
canvasRouter.get("/courses/:courseId/assignments", getAllAssignments);
canvasRouter.get("/courses/:courseId/assignments/:assignmentId", getAssignment);
canvasRouter.get(
  "/courses/:courseId/assignments/:assignmentId/submissions",
  getAssignmentSubmissions
);
canvasRouter.get("/courses/:courseId/modules/", getCourseModules);
canvasRouter.get("/courses/:courseId/modules/completion", getCourseModuleCompletion);
canvasRouter.get("/courses/:courseId/modules/:moduleId", getModule);
canvasRouter.get("/courses/:courseId/modules/:moduleId/completion", getModuleCompletion);
canvasRouter.get("/courses/:courseId/completed", getCourseCompleted);
canvasRouter.get("/courses/completed", getAllRequiredCoursesCompleted);

const airtableRouter = Router();
airtableRouter.get("/surveys", getAllSurveys);
airtableRouter.get("/surveys/:cohort", getCohortSurveys);
airtableRouter.get("/students", getAllStudents);
airtableRouter.get("/students/cohort/:cohort", getCohortStudents);
airtableRouter.get("/students/email/:email", getStudentByEmail);

const attendanceRouter = Router();
attendanceRouter.put("/event/:eventType/date/:eventDate", putEventAttendance);

const baseRouter = Router();
baseRouter.use("/users", userRouter);
baseRouter.use("/vars", envRouter);
baseRouter.use("/canvas", canvasRouter);
baseRouter.use("/airtable", airtableRouter);
baseRouter.use("/attendance", attendanceRouter);

export default baseRouter;
