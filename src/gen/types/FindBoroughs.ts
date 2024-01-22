import type { Error } from "./Error";
import type { Borough } from "./Borough";

export type FindBoroughs400 = Error;

export type FindBoroughs500 = Error;

/**
 * @description An object containing all boroughs.
 */
export type FindBoroughsQueryResponse = {
  /**
   * @type array
   */
  boroughs: Borough[];
};
