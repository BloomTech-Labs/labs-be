import StatusCodes from "http-status-codes";
import { Request, Response } from "express";

import UserDao from "@daos/User/UserDao.mock";
import { paramMissingError } from "@shared/constants";
import { IUser } from "@entities/User";

const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get all users.
 *
 * @param req
 * @param res
 * @returns
 */
export function getAllUsers(req: Request, res: Response): Response<IUser[]> {
  const users = (async () => {
    await userDao.getAll();
  })();
  return res.status(OK).json(users) as Response<IUser[]>;
}

/**
 * Add one user.
 *
 * @param req
 * @param res
 * @returns
 */
export function addOneUser(req: Request, res: Response): Response | void {
  const user = req.body as IUser;
  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  void (async () => {
    await userDao.add(user);
  })();
  return res.status(CREATED).end();
}

/**
 * Update one user.
 *
 * @param req
 * @param res
 * @returns
 */
export function updateOneUser(req: Request, res: Response): Response | void {
  const user = req.body as IUser;
  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  void (async () => {
    await userDao.update(user);
  })();
  return res.status(OK).end();
}

/**
 * Delete one user.
 *
 * @param req
 * @param res
 * @returns
 */
export function deleteOneUser(req: Request, res: Response): void {
  const { id } = req.params;
  void (async () => {
    await userDao.delete(id);
  })();
  return res.status(OK).end();
}
