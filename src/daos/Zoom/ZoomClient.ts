import { BaseClient, AuthTypes } from "@shared/BaseClient";
export interface IZoomClient {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  get: (path: string) => Promise<any | null>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

class ZoomClient extends BaseClient implements IZoomClient {
  constructor() {
    const opts = {
      token: process.env.zoom_access_token,
      baseUrl: "https://api.zoom.us/v2/",
      authType: AuthTypes.JWT,
    };

    super(opts);
  }
}

export default ZoomClient;