import type { TaxLotBlockGeoJson } from "./TaxLotBlockGeoJson";
import type { Error } from "./Error";

export type FindTaxLotBlockGeoJsonByBoroughIdBlockIdPathParams = {
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
/**
 * @description An geojson object for a block
 */
export type FindTaxLotBlockGeoJsonByBoroughIdBlockId200 = TaxLotBlockGeoJson;
/**
 * @description Invalid client request
 */
export type FindTaxLotBlockGeoJsonByBoroughIdBlockId400 = Error;
/**
 * @description Server side error
 */
export type FindTaxLotBlockGeoJsonByBoroughIdBlockId500 = Error;
/**
 * @description An geojson object for a block
 */
export type FindTaxLotBlockGeoJsonByBoroughIdBlockIdQueryResponse =
  TaxLotBlockGeoJson;
export type FindTaxLotBlockGeoJsonByBoroughIdBlockIdQuery = {
  Response: FindTaxLotBlockGeoJsonByBoroughIdBlockIdQueryResponse;
  PathParams: FindTaxLotBlockGeoJsonByBoroughIdBlockIdPathParams;
  Errors:
    | FindTaxLotBlockGeoJsonByBoroughIdBlockId400
    | FindTaxLotBlockGeoJsonByBoroughIdBlockId500;
};
