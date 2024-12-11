import type { CapitalCommitmentType } from "./CapitalCommitmentType";
import type { Error } from "./Error";

/**
 * @description An object containing all capital commitment types.
 */
export type FindCapitalCommitmentTypes200 = {
  /**
   * @type array
   */
  capitalCommitmentTypes: CapitalCommitmentType[];
};
/**
 * @description Invalid client request
 */
export type FindCapitalCommitmentTypes400 = Error;
/**
 * @description Server side error
 */
export type FindCapitalCommitmentTypes500 = Error;
/**
 * @description An object containing all capital commitment types.
 */
export type FindCapitalCommitmentTypesQueryResponse = {
  /**
   * @type array
   */
  capitalCommitmentTypes: CapitalCommitmentType[];
};
export type FindCapitalCommitmentTypesQuery = {
  Response: FindCapitalCommitmentTypesQueryResponse;
  Errors: FindCapitalCommitmentTypes400 | FindCapitalCommitmentTypes500;
};
