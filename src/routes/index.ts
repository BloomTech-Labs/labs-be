import { Router } from 'express';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
import { getAllVars } from './env';
import { getAllAssignments, getAssignment, getAssignmentSubmissions } from './Canvas';


// User-route
const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);

const envRouter = Router();
envRouter.get('/all', getAllVars);

const canvasRouter = Router();
canvasRouter.get('/assignments', getAllAssignments);
canvasRouter.get('/assignments/:id', getAssignment);
canvasRouter.get('/assignments/:id/submissions', getAssignmentSubmissions);


// Export the base-router
const baseRouter = Router();
baseRouter.use('/users', userRouter);
baseRouter.use('/vars', envRouter);
baseRouter.use('/canvas', canvasRouter);
export default baseRouter;
