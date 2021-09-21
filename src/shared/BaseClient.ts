import fetch from "node-fetch";
import { Response } from "express";
import { RequestInit, HeadersInit, BodyInit } from "node-fetch";

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

  constructor(opts: Record<string, unknown> = {}) {
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
    body: BodyInit = ""
  ): ClientResponse<T> {
    const url = `${this.options.baseUrl as string}${path}`;
    const myHeaders: HeadersInit = Object.assign(
      this.headers,
      headers
    ) as HeadersInit;
    const config: RequestInit = {
      headers: myHeaders,
      method,
      body: body ? JSON.stringify(body) : undefined,
    };
    
    const res = await fetch(url, config);
    return res.json() as ClientResponse<T>;
  }

  public get(path: string): ClientResponse<T> | ClientArrayResponse<T> {
    return this.request(path);
  }

  public put (path: string, body = {}): ClientResponse<T> {
    return this.request(path, "PUT", {}, body as BodyInit);
  }

  public post(path: string, body = {}): ClientResponse<T> {
    if (body == {}) {
      throw new Error("Body is missing for POST method.");
    }
    return this.request(path, "POST", {}, body as BodyInit);
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
