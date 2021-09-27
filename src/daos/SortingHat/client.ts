import { Request, Response } from "express";
import {
  BaseClient,
  AuthTypes,
  ClientResponse,
  ClientArrayResponse,
} from "@shared/BaseClient";

export interface ISortingHatClient<T> {
  get: (path: string) => ClientResponse<T> | ClientArrayResponse<T>;
}

class SortingHatClient<T> extends BaseClient<T> implements ISortingHatClient<T> {
  constructor() {
    const opts = {
      // token: process.env.CANVAS_ACCESS_TOKEN,
      baseUrl: process.env.SORTING_HAT_URL,
      // authType: AuthTypes.JWT,
    };

    super(opts);
  }
}

export default SortingHatClient;
