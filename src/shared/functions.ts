import logger from "./Logger";
import Papa, { ParseError, ParseResult } from "papaparse";
import request from "request";
import { Stream } from "stream";

export const pErr = (err: Error): void => {
  if (err) {
    logger.err(err);
  }
};

export const chunkArray = (array: unknown[], chunkSize: number): unknown[] => {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunkedArray.push(array.slice(i, i + chunkSize));
  }
  return chunkedArray;
};

export const getRandomInt = (): number => {
  return Math.floor(Math.random() * 1_000_000_000_000);
};

export const getRandomStringId = (length: number): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const parseCsvUrl = async (
  url: string,
  options?: Record<string, unknown>
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const dataStream: Stream = request.get(url) as unknown as Stream;
    const parseStream: NodeJS.ReadWriteStream = Papa.parse(
      Papa.NODE_STREAM_INPUT,
      options
    );

    if (!dataStream || !parseStream) {
      return null;
    }

    dataStream.pipe(parseStream);

    const data: unknown[] = [];
    parseStream.on("data", (chunk) => {
      data.push(chunk);
    });

    parseStream.on("finish", () => {
      return resolve(data);
    });

    parseStream.on("error", (error) => {
      return reject(error);
    });
  });
};

export const mergeObjectArrays = (
  property: string,
  arrays: unknown[][]
): unknown[] => {
  // Arrays must share at least one property in common.

  let combined: Record<string, unknown>[] = [] as Record<string, unknown>[];

  // Merge the raw arrays together. This results in an array that may have
  // duplicate objects with the same property of interest.
  for (const array of arrays) {
    combined = [...combined, ...array] as Record<string, unknown>[];
  }

  combined = combined.reduce((acc, cur) => {
    let existing = acc.find((x) => x[property] === cur[property]);
    if (existing) {
      existing = { ...existing, ...cur };
      const i = acc.findIndex((x) => x[property] === cur[property]);
      acc[i] = existing;
    } else {
      acc.push(cur);
    }
    return acc;
  }, [] as Record<string, unknown>[]);

  return combined;
};

export const getRandomValue = (
  values: unknown[]
): unknown => {
  return values[Math.floor(Math.random() * values.length)];
};

export function hasOwnProperty<X extends Record<string,unknown>, Y extends PropertyKey> (
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}
