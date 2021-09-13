import fetch from "node-fetch";
import { RequestInit, HeadersInit, BodyInit } from "node-fetch";

export enum AuthTypes {
  JWT = "JWT",
}
export interface IBaseClient {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  get: (path: string) => Promise<any | null>;
  post: (path: string, body: any) => Promise<any | null>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

class BaseClient implements IBaseClient {
  public options: Record<string, unknown>;
  public headers: Record<string, unknown>;

  constructor(opts: Record<string, unknown> = {}) {
    if (opts.auth_type == AuthTypes.JWT && !opts.token) {
      throw new Error("missing api JWT token option");
    }
    this.options = Object.assign(
      {
        base_url: opts.base_url,
      },
      opts
    );
    this.headers = {
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    };
    if (opts.auth_type == AuthTypes.JWT) {
      this.headers.Authorization = `Bearer ${opts.token as string}`;
    }
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public async request(
    path = "/",
    method = "GET",
    headers = {},
    body: BodyInit = ""
  ): Promise<any> {
    const url = `${this.options.base_url as string}${path}`;
    const myHeaders: HeadersInit = Object.assign(
      this.headers,
      headers
    ) as HeadersInit;
    const config: RequestInit = {
      headers: myHeaders,
      method,
      body: JSON.stringify(body),
    };

    const res = await fetch(url, config);
    return res.json();
  }

  public get(path: string): Promise<any> {
    return this.request(path);
  }

  public post(path: string, body = {}): Promise<any> {
    if (body == {}) {
      throw new Error("Body is missing for POST method.");
    }
    return this.request(path, "POST", {}, body as BodyInit);
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default BaseClient;
