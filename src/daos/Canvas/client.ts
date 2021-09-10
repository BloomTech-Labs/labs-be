import BaseClient from "@shared/BaseClient";
export interface ICanvasClient {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  get: (path: string) => Promise<any | null>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

class CanvasClient extends BaseClient implements ICanvasClient {}

export default CanvasClient;
