import type { Borough } from "./Borough";

/**
 * @description An array of borough objects.
 */
export type GetBoroughsQueryResponse = {
  /**
   * @type array | undefined
   */
  boroughs?: Borough[];
};
