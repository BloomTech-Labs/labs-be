import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { join } from "path";

import { paramMissingError } from '@shared/constants';

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get the auth configuration file.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
 export async function getAuthConfig(req: Request, res: Response) {
  const authConfig = (join(__dirname, "..", "auth_config.json"));
  return res.status(OK).sendFile(authConfig);
}