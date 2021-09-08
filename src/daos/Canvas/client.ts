import fetch from 'node-fetch';

export interface ICanvasClient {
  get: (path: string) => any | null;
}

class CanvasClient {
  
  public options: any;
  public headers: any;

  constructor(opts: any) {
    if(!opts.token) { throw new Error("Missing Canvas API token option") }
    this.options =  Object.assign({
      base_url: 'https://lambdaschool.instructure.com/api/v1/',
      ver: "/v1"
    }, opts);
    this.headers = {
      "Authorization": `Bearer ${opts.token}`,
      "Content-Type": "application/vnd.api+json",
      "Accept": "application/vnd.api+json"
    }
  }

  public async request(path: string = "", options = {}) {
    const url = this.options.base_url + path

    const config = {
      ...options,
      headers: this.headers
    }

    const res = await fetch(url, config);
    // TODO: Pagination: Need to either return res.headers to retrieve Link
    // to "next" or process it here for all queries.
    return await res.json();
  }

  public get(path: string): any {
    return this.request(path);
  }
}

export default CanvasClient;