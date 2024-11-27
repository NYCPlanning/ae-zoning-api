import type { Page } from "./Page";
import type { TaxLotLotId } from "./TaxLotLotId";

export type TaxLotLotIdPage = Page & {
  /**
   * @type array
   */
  lotIds: TaxLotLotId[];
};
