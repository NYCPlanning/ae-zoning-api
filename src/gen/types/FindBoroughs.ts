import type { Borough } from "./Borough";
import type { Error } from "./Error";

/**
 * @description An object containing all boroughs.
 */
export type FindBoroughs200 = {
  /**
   * @type array
   */
  boroughs: Borough[];
};
/**
 * @description Invalid client request
 */
export type FindBoroughs400 = Error;
/**
 * @description Server side error
 */
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
export type FindBoroughsQuery = {
  Response: FindBoroughsQueryResponse;
  Errors: FindBoroughs400 | FindBoroughs500;
};
