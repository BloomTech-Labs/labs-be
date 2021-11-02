import {
  BaseClient,
  ClientResponse,
  ClientArrayResponse,
} from "@shared/BaseClient";

export interface ISortingHatClient<T> {
  get: (path: string) => ClientResponse<T> | ClientArrayResponse<T>;
  put: (path: string, body?: Record<string, unknown>) => ClientResponse<T>;
  post: (path: string, body?: Record<string, unknown>) => ClientResponse<T>;
}

class SortingHatClient<T>
  extends BaseClient<T>
  implements ISortingHatClient<T>
{
  constructor() {
    const opts = {
      baseUrl: process.env.SORTING_HAT_URL,
    };

    super(opts);
  }
}

export default SortingHatClient;
