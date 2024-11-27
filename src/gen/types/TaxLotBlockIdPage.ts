import type { Page } from "./Page";
import type { TaxLotBlockId } from "./TaxLotBlockId";

export type TaxLotBlockIdPage = Page & {
  /**
   * @type array
   */
  blockIds: TaxLotBlockId[];
};
