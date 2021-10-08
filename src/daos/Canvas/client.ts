import { Response } from "express";
import * as Fetch from "node-fetch";
import {
  BaseClient,
  AuthTypes,
  BaseResponse,
  ReponseDataError,
  ClientResponse,
} from "@shared/BaseClient";
import logger from "@shared/Logger";

export interface ICanvasClient<T> {
  get: (path: string) => ClientResponse<T>;
}

interface ICanvasErrors {
  errors: [{ message: string }];
}

type ParsedLinks = Record<string, string | null>;

class CanvasClient<T> extends BaseClient<T> implements ICanvasClient<T> {
  constructor() {
    const opts = {
      token: process.env.CANVAS_ACCESS_TOKEN,
      baseUrl: "https://lambdaschool.instructure.com/api/v1/",
      authType: AuthTypes.JWT,
      errorFn: (data: ReponseDataError) => {
        const json = data as {
          errors: [{ message: string }];
        };
        return json["errors"][0]["message"];
      },
    };

    super(opts);
  }

  public getAllResources(
    path: string,
    opts: Record<string, unknown> = { pageSize: 50 }
  ): Promise<T[]> {
    const collection: T[] = [];
    return new Promise<T[]>((resolve, reject) => {
      const _get = (_path: string, options: Record<string, unknown>) => {
        logger.info(options, true);
        setTimeout(() => {
          void (async () => {
            let newPath = `${_path}?per_page=${options.pageSize as number}`;
            if (options.pageNumber) {
              newPath = `${newPath}&page=${options.pageNumber as string}`;
            }
            const response = await this.get(newPath);
            // logger.info(response, true);
            if (response.error) {
              reject(new Error(response.error));
            } else {
              const items = response.data as T[];
              logger.info(`${items.length} items found`);
              if (items.length > 0) {
                collection.push(...items);

                const linkHeaders = response.headers.get("Link");
                if (linkHeaders) {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                  const pages: ParsedLinks =
                    this.parse_link_header(linkHeaders);
                  if (pages.next) {
                    const qstring = pages.next.split("?")[1];
                    const params = qstring.split("&");
                    const param = params.find((p) => {
                      return p.split("=")[0] == "page";
                    }) as string;
                    if (param) {
                      options.pageNumber = param.split("=")[1];
                      _get(_path, options);
                    }
                  } else {
                    logger.info(`${collection.length} items in collection`);
                    resolve(collection);
                  }
                }
              }
            }
          })();
        }, 2000);
      };
      _get(path, opts);
    });
  }

  private parse_link_header(header: string): ParsedLinks {
    if (header.length == 0) {
      return {};
    }

    const parts = header.split(",");
    const links: ParsedLinks = {};
    parts.forEach((p) => {
      const section = p.split(";");
      const url = section[0].replace(/<(.*)>/, "$1").trim();
      const name = section[1].replace(/rel="(.*)"/, "$1").trim();
      links[name] = url;
    });
    return links;
  }
}

export default CanvasClient;
