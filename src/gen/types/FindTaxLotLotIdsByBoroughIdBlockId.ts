import type { TaxLotLotIdPage } from "./TaxLotLotIdPage";
import type { Error } from "./Error";

export type FindTaxLotLotIdsByBoroughIdBlockIdPathParams = {
  /**
   * @description A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.
   * @type string
   */
  boroughId: string;
  /**
   * @description A multi-character numeric string containing the common number used to refer to the block of a bbl.
   * @type string
   */
  blockId: string;
};
export type FindTaxLotLotIdsByBoroughIdBlockIdQueryParams = {
  /**
   * @description A multi-character numeric string containing the common number used to refer to the lot of a bbl. Does not need to include leading zeros.
   * @type string | undefined
   */
  lotIdQuery?: string;
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
 * @description An object containing a list of lot ids and pagination metadata for tax lots in a block. Optionally, results may be limited to lots matching a query.
 */
export type FindTaxLotLotIdsByBoroughIdBlockId200 = TaxLotLotIdPage;
/**
 * @description Invalid client request
 */
export type FindTaxLotLotIdsByBoroughIdBlockId400 = Error;
/**
 * @description Server side error
 */
export type FindTaxLotLotIdsByBoroughIdBlockId500 = Error;
/**
 * @description An object containing a list of lot ids and pagination metadata for tax lots in a block. Optionally, results may be limited to lots matching a query.
 */
export type FindTaxLotLotIdsByBoroughIdBlockIdQueryResponse = TaxLotLotIdPage;
export type FindTaxLotLotIdsByBoroughIdBlockIdQuery = {
  Response: FindTaxLotLotIdsByBoroughIdBlockIdQueryResponse;
  PathParams: FindTaxLotLotIdsByBoroughIdBlockIdPathParams;
  QueryParams: FindTaxLotLotIdsByBoroughIdBlockIdQueryParams;
  Errors:
    | FindTaxLotLotIdsByBoroughIdBlockId400
    | FindTaxLotLotIdsByBoroughIdBlockId500;
};
