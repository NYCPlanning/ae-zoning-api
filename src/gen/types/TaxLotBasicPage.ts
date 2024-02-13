import type { Page } from "./Page";
import type { TaxLotBasic } from "./TaxLotBasic";

export type TaxLotBasicPage = Page & {
  /**
   * @type array
   */
  taxLots: TaxLotBasic[];
};
