import { Response } from "express";
import fetch from "node-fetch";
import * as Fetch from "node-fetch";
import logger from "@shared/Logger";

export enum AuthTypes {
  JWT = "JWT",
}

export type ClientResponse<T> = Promise<Response<T> | null>;
export type ClientArrayResponse<T> = Promise<Response<T[]> | null>;

export interface IBaseClient<T> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  get: (path: string) => ClientResponse<T> | ClientArrayResponse<T>;
  put: (path: string, body: any) => ClientResponse<T>;
  post: (path: string, body: any) => ClientResponse<T>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export class BaseClient<T> implements IBaseClient<T> {
  options: Record<string, unknown>;
  headers: Record<string, unknown> = {
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
  };

  constructor(opts: Record<string, unknown> = { debug: false }) {
    if (opts.auth_type == AuthTypes.JWT && !opts.token) {
      throw new Error("missing api JWT token option");
    }
    this.options = opts;
    if (opts.authType == AuthTypes.JWT) {
      this.headers.Authorization = `Bearer ${opts.token as string}`;
    }
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public async request(
    path = "/",
    method = "GET",
    headers = {},
    body: Fetch.BodyInit = ""
  ): ClientResponse<T> {
    const url = `${this.options.baseUrl as string}${path}`;
    const myHeaders: Fetch.HeadersInit = Object.assign(
      this.headers,
      headers
    ) as Fetch.HeadersInit;
    const config: Fetch.RequestInit = {
      headers: myHeaders,
      method,
      body: body ? JSON.stringify(body) : undefined,
    };
    logger.info(`fetching ${url}`);
    logger.imp(myHeaders, true);
    // myHeaders.forEach((value: string, key: string) => {
    //   logger.imp(`  [header] ${key}: ${value}`);
    // });
    const res: Fetch.Response = await fetch(url, config);
    try {
      this.checkStatus(res);
    } catch (e) {
      const json = (await res.json()) as {
        errors: [{ message: string }];
      };
      const message = json["errors"][0]["message"];
      throw new Error(message);
    }

    logger.info(`fetched status (${res.status})`);
    return res.json() as ClientResponse<T>;
  }

  public get(path: string): ClientResponse<T> | ClientArrayResponse<T> {
    return this.request(path);
  }

  public put(path: string, body = {}): ClientResponse<T> {
    return this.request(path, "PUT", {}, body as Fetch.BodyInit);
  }

  public post(path: string, body = {}): ClientResponse<T> {
    if (body == {}) {
      throw new Error("Body is missing for POST method.");
    }
    return this.request(path, "POST", {}, body as Fetch.BodyInit);
  }

  private checkStatus(res: Fetch.Response): Fetch.Response {
    if (res.status >= 200 && res.status < 300) {
      return res;
    } else {
      throw new Error(res.statusText);
    }
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
