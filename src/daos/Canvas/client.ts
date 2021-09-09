import fetch from "node-fetch";

export interface IClanvasClient {
  get: (path: string) => Promise<any | null>;
}

class CanvasClient {
  public options: Record<string, unknown>;
  public headers: Record<string, unknown>;

  constructor(opts: Record<string, unknown> = {}) {
    if (!opts.token) {
      throw new Error("missing canvas api token option");
    }
    this.options = Object.assign(
      {
        base_url: "https://lambdaschool.instructure.com/api/v1/",
        ver: "/v1",
      },
      opts
    );
    this.headers = {
      Authorization: `Bearer ${opts.token}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
    };
  }

  public async request(path = "", options: unknown = {}): Promise<any> {
    const url = `${this.options.base_url}${path}`;

    const config = {
      ...options,
      headers: this.headers,
    };

    const res = await fetch(url, config);
    return await res.json();
  }

  public get(path: string): Promise<any> {
    return this.request(path);
  }
}

export default CanvasClient;
