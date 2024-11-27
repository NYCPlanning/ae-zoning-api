import type { TaxLotBlockIdPage } from "./TaxLotBlockIdPage";
import type { Error } from "./Error";

export type FindTaxLotBlockIdsByBoroughIdPathParams = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   */
  boroughId: string;
};
export type FindTaxLotBlockIdsByBoroughIdQueryParams = {
  /**
   * @description A multi-character numeric string containing the common number used to refer to the block of a bbl. Does not need to include leading zeros.
   * @type string | undefined
   */
  blockIdQuery?: string;
  /**
   * @description The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.
   * @type integer | undefined
   */
  limit?: number;
  /**
   * @description The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.
   * @type integer | undefined
   */
  offset?: number;
};
/**
 * @description An object containing a list of block ids and pagination metadata for tax lots in a borough. Optionally, results may be limited to blocks matching a query.
 */
export type FindTaxLotBlockIdsByBoroughId200 = TaxLotBlockIdPage;
/**
 * @description Invalid client request
 */
export type FindTaxLotBlockIdsByBoroughId400 = Error;
/**
 * @description Server side error
 */
export type FindTaxLotBlockIdsByBoroughId500 = Error;
/**
 * @description An object containing a list of block ids and pagination metadata for tax lots in a borough. Optionally, results may be limited to blocks matching a query.
 */
export type FindTaxLotBlockIdsByBoroughIdQueryResponse = TaxLotBlockIdPage;
export type FindTaxLotBlockIdsByBoroughIdQuery = {
  Response: FindTaxLotBlockIdsByBoroughIdQueryResponse;
  PathParams: FindTaxLotBlockIdsByBoroughIdPathParams;
  QueryParams: FindTaxLotBlockIdsByBoroughIdQueryParams;
  Errors: FindTaxLotBlockIdsByBoroughId400 | FindTaxLotBlockIdsByBoroughId500;
};
