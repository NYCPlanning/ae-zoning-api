import type { TaxLotBasicPage } from "./TaxLotBasicPage";
import type { Error } from "./Error";

export type FindTaxLotsByBoroughIdPathParams = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   */
  boroughId: string;
};
export type FindTaxLotsByBoroughIdQueryParams = {
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
 * @description An object containing a list of tax lots and pagination metadata for tax lots in a borough. Optionally, results may be limited to blocks matching a query.
 */
export type FindTaxLotsByBoroughId200 = TaxLotBasicPage;
/**
 * @description Invalid client request
 */
export type FindTaxLotsByBoroughId400 = Error;
/**
 * @description Server side error
 */
export type FindTaxLotsByBoroughId500 = Error;
/**
 * @description An object containing a list of tax lots and pagination metadata for tax lots in a borough. Optionally, results may be limited to blocks matching a query.
 */
export type FindTaxLotsByBoroughIdQueryResponse = TaxLotBasicPage;
export type FindTaxLotsByBoroughIdQuery = {
  Response: FindTaxLotsByBoroughIdQueryResponse;
  PathParams: FindTaxLotsByBoroughIdPathParams;
  QueryParams: FindTaxLotsByBoroughIdQueryParams;
  Errors: FindTaxLotsByBoroughId400 | FindTaxLotsByBoroughId500;
};
