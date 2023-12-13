import type { Error } from "./Error";
import type { Borough } from "./Borough";

export type GetBoroughs400 = Error;

export type GetBoroughs500 = Error;

/**
 * @description An object containing all boroughs.
 */
export type GetBoroughsQueryResponse = {
  /**
   * @type array
   */
  boroughs: Borough[];
};
