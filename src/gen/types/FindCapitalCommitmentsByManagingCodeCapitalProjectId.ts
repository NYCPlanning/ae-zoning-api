import type { Error } from "./Error";
import type { CapitalCommitment } from "./CapitalCommitment";

export type FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams = {
  /**
   * @description Three character string of numbers representing managing agency
   * @type string
   * @example 801
   */
  managingCode: string;
  /**
   * @description The id for the project, which combines with the managing code to make a unique id
   * @type string
   * @example HWPEDSF5
   */
  capitalProjectId: string;
};

export type FindCapitalCommitmentsByManagingCodeCapitalProjectId400 = Error;

export type FindCapitalCommitmentsByManagingCodeCapitalProjectId404 = Error;

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
  };
