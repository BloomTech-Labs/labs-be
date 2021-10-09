import fetch from "node-fetch";
import * as Fetch from "node-fetch";
import logger from "@shared/Logger";

export enum AuthTypes {
  JWT = "JWT",
}

export type ClientResponse<T> = Promise<BaseResponse<T>>;
export type ReponseDataError = Record<string, unknown>;
export type ResponseErrorFn = (data: ReponseDataError) => string;

export class BaseResponse<T> {
  public data: T | T[] | null;
  public error: string | null;
  public status: number;
  public statusText: string;
  public headers: Fetch.Headers;

  public static async build<T>(
    response: Fetch.Response,
    getErrorMsg: ResponseErrorFn
  ): ClientResponse<T> {
    const resp = new BaseResponse<T>();
    const p = response.json();
    const data = (await p) as T;
    try {
      resp.status = response.status;
      resp.statusText = response.statusText;
      resp.checkStatus(response);
      resp.data = data;
      resp.headers = response.headers;
    } catch (e) {
      logger.err(data, true);
      resp.error = getErrorMsg(data as ReponseDataError);
    } finally {
      logger.info("[BuildResponse] OK");
      return new Promise((resolve) => {
        resolve(resp);
      });
    }
  }

  // constructor() {}

  private checkStatus(res: Fetch.Response): Fetch.Response {
    if (res.status >= 200 && res.status < 300) {
      return res;
    } else {
      throw new Error(res.statusText);
    }
  }
}

export interface IBaseClient<T> {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  get: (path: string) => ClientResponse<T>;
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
  requestErrorFn: ResponseErrorFn = (data: ReponseDataError): string => {
    return data.statusText as string;
  };

  constructor(opts: Record<string, unknown> = { debug: false }) {
    if (opts.auth_type == AuthTypes.JWT && !opts.token) {
      throw new Error("missing api JWT token option");
    }
    this.options = opts;
    if (opts.authType == AuthTypes.JWT) {
      this.headers.Authorization = `Bearer ${opts.token as string}`;
    }
    if (opts.errorFn) {
      this.requestErrorFn = opts.errorFn as ResponseErrorFn;
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
    try {
      logger.info(`[request] fetching ${url}`);
      const f = fetch(url, config);
      const res: Fetch.Response = await f;
      logger.info(`[request] res.status (${res.status})`);
      const p = BaseResponse.build<T>(res, this.requestErrorFn);
      const response = await p;
      logger.info(`[request] response.statusText: ${response.statusText}`);
      return new Promise((resolve) => {
        resolve(response);
      });
    } catch (e) {
      const err: Error = e as Error;
      logger.err(err, true);
      const bp = new BaseResponse<T>();
      bp.error = err.message;
      return new Promise((res) => res(bp));
    }
  }

  public get(path: string): ClientResponse<T> {
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
}
/* eslint-enable @typescript-eslint/no-explicit-any */
