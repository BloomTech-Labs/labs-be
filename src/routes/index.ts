import { Router } from 'express';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
import { getAllVars } from './env';
import { getAllAssignments, getAssignment, getAssignmentSubmissions } from './Canvas';
import { getAuthConfig } from './auth';
import { getAllSurveys, getCohortSurveys } from './AirTable';


const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);

const envRouter = Router();
envRouter.get('/all', getAllVars);

const authRouter = Router();
authRouter.get ('/auth/config', getAuthConfig);

const canvasRouter = Router();
canvasRouter.get('/assignments', getAllAssignments);
canvasRouter.get('/assignments/:id', getAssignment);
canvasRouter.get('/assignments/:id/submissions', getAssignmentSubmissions);

const airtableRouter = Router();
airtableRouter.get('/surveys', getAllSurveys);
airtableRouter.get('/surveys/:cohort', getCohortSurveys);


const baseRouter = Router();
baseRouter.use('/users', userRouter);
baseRouter.use('/vars', envRouter);
baseRouter.use('/canvas', canvasRouter);
baseRouter.use('/airtable', airtableRouter);

export default {
  baseRouter,
  authRouter,
};
