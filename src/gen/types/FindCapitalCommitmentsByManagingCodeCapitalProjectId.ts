import type { CapitalCommitment } from "./CapitalCommitment";
import type { Error } from "./Error";

export type FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams = {
  /**
   * @description Three character string of numbers representing managing agency
   * @type string
   */
  managingCode: string;
  /**
   * @description The id for the project, which combines with the managing code to make a unique id
   * @type string
   */
  capitalProjectId: string;
};
/**
 * @description an object of capital commitments for the capital project
 */
export type FindCapitalCommitmentsByManagingCodeCapitalProjectId200 = {
  /**
   * @type array
   */
  capitalCommitments: CapitalCommitment[];
  /**
   * @description Capital commitment dates are sorted in ascending order
   * @type string
   */
  order: string;
};
/**
 * @description Invalid client request
 */
export type FindCapitalCommitmentsByManagingCodeCapitalProjectId400 = Error;
/**
 * @description Requested resource does not exist or is not available
 */
export type FindCapitalCommitmentsByManagingCodeCapitalProjectId404 = Error;
/**
 * @description Server side error
 */
export type FindCapitalCommitmentsByManagingCodeCapitalProjectId500 = Error;
/**
 * @description an object of capital commitments for the capital project
 */
export type FindCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponse =
  {
    /**
     * @type array
     */
    capitalCommitments: CapitalCommitment[];
    /**
     * @description Capital commitment dates are sorted in ascending order
     * @type string
     */
    order: string;
  };
export type FindCapitalCommitmentsByManagingCodeCapitalProjectIdQuery = {
  Response: FindCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponse;
  PathParams: FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams;
  Errors:
    | FindCapitalCommitmentsByManagingCodeCapitalProjectId400
    | FindCapitalCommitmentsByManagingCodeCapitalProjectId404
    | FindCapitalCommitmentsByManagingCodeCapitalProjectId500;
};
