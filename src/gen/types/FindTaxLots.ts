import type { Error } from "./Error";
import type { TaxLotBasicPage } from "./TaxLotBasicPage";

export type FindTaxLotsQueryParams = {
  /**
   * @description The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.
   * @type string | undefined
   * @example 100
   */
  limit?: string;
  /**
   * @description The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.
   * @type string | undefined
   * @example 100
   */
  offset?: string;
};

export type FindTaxLots400 = Error;

export type FindTaxLots500 = Error;

/**
 * @description An object containing a list of tax lots and pagination metadata
 */
export type FindTaxLotsQueryResponse = TaxLotBasicPage;
