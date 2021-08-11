import { Router } from 'express';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
import { getAllVars } from './env';
import { assignRolesForUnit } from './roles';


// User-route
const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);

const envRouter = Router();
envRouter.get('/all', getAllVars);

const roleRouter = Router();
roleRouter.get('/assign/:unitId', assignRolesForUnit);


// Export the base-router
const baseRouter = Router();
baseRouter.use('/users', userRouter);
baseRouter.use('/vars', envRouter);
baseRouter.use('/roles', roleRouter);
export default baseRouter;
