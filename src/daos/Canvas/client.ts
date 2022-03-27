import { Request, Response } from "express";
import {
  BaseClient,
  AuthTypes,
  ClientResponse,
  ClientArrayResponse,
} from "@shared/BaseClient";

export interface ICanvasClient<T> {
  get: (path: string) => ClientResponse<T> | ClientArrayResponse<T>;
}

class CanvasClient<T> extends BaseClient<T> implements ICanvasClient<T> {
  constructor() {
    const opts = {
      token: process.env.CANVAS_ACCESS_TOKEN,
      baseUrl: "https://bloomtech.instructure.com/api/v1/",
      authType: AuthTypes.JWT,
    };

    super(opts);
  }
}

export default CanvasClient;
