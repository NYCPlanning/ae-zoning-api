import { Page } from "./Page";
import { TaxLotBasic } from "./TaxLotBasic";

export type TaxLotBasicPage = Page & {
  /**
   * @type array
   */
  taxLots: TaxLotBasic[];
};
