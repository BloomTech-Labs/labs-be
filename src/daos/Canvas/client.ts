import { BaseClient, AuthTypes } from "@shared/BaseClient";
export interface ICanvasClient {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  get: (path: string) => Promise<any | null>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

class CanvasClient extends BaseClient implements ICanvasClient {
  constructor() {
    const opts = {
      token: process.env.canvas_access_token,
      baseUrl: "https://lambdaschool.instructure.com/api/v1/",
      authType: AuthTypes.JWT,
    };

    super(opts);
  }
}

export default CanvasClient;
