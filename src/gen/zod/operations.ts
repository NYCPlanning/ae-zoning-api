import {
  findAgenciesQueryResponseSchema,
  findAgencies400Schema,
  findAgencies500Schema,
} from "./findAgenciesSchema";
import {
  findBoroughsQueryResponseSchema,
  findBoroughs400Schema,
  findBoroughs500Schema,
} from "./findBoroughsSchema";
import {
  findCommunityDistrictsByBoroughIdQueryResponseSchema,
  findCommunityDistrictsByBoroughId400Schema,
  findCommunityDistrictsByBoroughId404Schema,
  findCommunityDistrictsByBoroughId500Schema,
  findCommunityDistrictsByBoroughIdPathParamsSchema,
} from "./findCommunityDistrictsByBoroughIdSchema";
import {
  findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema,
  findCapitalProjectsByBoroughIdCommunityDistrictId400Schema,
  findCapitalProjectsByBoroughIdCommunityDistrictId404Schema,
  findCapitalProjectsByBoroughIdCommunityDistrictId500Schema,
  findCapitalProjectsByBoroughIdCommunityDistrictIdPathParamsSchema,
  findCapitalProjectsByBoroughIdCommunityDistrictIdQueryParamsSchema,
} from "./findCapitalProjectsByBoroughIdCommunityDistrictIdSchema";
import {
  findCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalCommitmentsByManagingCodeCapitalProjectId400Schema,
  findCapitalCommitmentsByManagingCodeCapitalProjectId404Schema,
  findCapitalCommitmentsByManagingCodeCapitalProjectId500Schema,
  findCapitalCommitmentsByManagingCodeCapitalProjectIdPathParamsSchema,
} from "./findCapitalCommitmentsByManagingCodeCapitalProjectIdSchema";
import {
  findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalProjectGeoJsonByManagingCodeCapitalProjectId400Schema,
  findCapitalProjectGeoJsonByManagingCodeCapitalProjectId404Schema,
  findCapitalProjectGeoJsonByManagingCodeCapitalProjectId500Schema,
  findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParamsSchema,
} from "./findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdSchema";
import {
  findCapitalProjectByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalProjectByManagingCodeCapitalProjectId400Schema,
  findCapitalProjectByManagingCodeCapitalProjectId404Schema,
  findCapitalProjectByManagingCodeCapitalProjectId500Schema,
  findCapitalProjectByManagingCodeCapitalProjectIdPathParamsSchema,
} from "./findCapitalProjectByManagingCodeCapitalProjectIdSchema";
import {
  findCapitalProjectTilesQueryResponseSchema,
  findCapitalProjectTiles400Schema,
  findCapitalProjectTiles500Schema,
  findCapitalProjectTilesPathParamsSchema,
} from "./findCapitalProjectTilesSchema";
import {
  findCityCouncilDistrictsQueryResponseSchema,
  findCityCouncilDistricts400Schema,
  findCityCouncilDistricts500Schema,
} from "./findCityCouncilDistrictsSchema";
import {
  findCapitalProjectsByCityCouncilIdQueryResponseSchema,
  findCapitalProjectsByCityCouncilId400Schema,
  findCapitalProjectsByCityCouncilId404Schema,
  findCapitalProjectsByCityCouncilId500Schema,
  findCapitalProjectsByCityCouncilIdPathParamsSchema,
  findCapitalProjectsByCityCouncilIdQueryParamsSchema,
} from "./findCapitalProjectsByCityCouncilIdSchema";
import {
  findCityCouncilDistrictTilesQueryResponseSchema,
  findCityCouncilDistrictTiles400Schema,
  findCityCouncilDistrictTiles500Schema,
  findCityCouncilDistrictTilesPathParamsSchema,
} from "./findCityCouncilDistrictTilesSchema";
import {
  findCommunityDistrictTilesQueryResponseSchema,
  findCommunityDistrictTiles400Schema,
  findCommunityDistrictTiles500Schema,
  findCommunityDistrictTilesPathParamsSchema,
} from "./findCommunityDistrictTilesSchema";
import {
  findLandUsesQueryResponseSchema,
  findLandUses400Schema,
  findLandUses500Schema,
} from "./findLandUsesSchema";
import {
  findTaxLotsQueryResponseSchema,
  findTaxLots400Schema,
  findTaxLots500Schema,
  findTaxLotsQueryParamsSchema,
} from "./findTaxLotsSchema";
import {
  findTaxLotByBblQueryResponseSchema,
  findTaxLotByBbl400Schema,
  findTaxLotByBbl404Schema,
  findTaxLotByBbl500Schema,
  findTaxLotByBblPathParamsSchema,
} from "./findTaxLotByBblSchema";
import {
  findTaxLotGeoJsonByBblQueryResponseSchema,
  findTaxLotGeoJsonByBbl400Schema,
  findTaxLotGeoJsonByBbl404Schema,
  findTaxLotGeoJsonByBbl500Schema,
  findTaxLotGeoJsonByBblPathParamsSchema,
} from "./findTaxLotGeoJsonByBblSchema";
import {
  findZoningDistrictsByTaxLotBblQueryResponseSchema,
  findZoningDistrictsByTaxLotBbl400Schema,
  findZoningDistrictsByTaxLotBbl404Schema,
  findZoningDistrictsByTaxLotBbl500Schema,
  findZoningDistrictsByTaxLotBblPathParamsSchema,
} from "./findZoningDistrictsByTaxLotBblSchema";
import {
  findZoningDistrictClassesByTaxLotBblQueryResponseSchema,
  findZoningDistrictClassesByTaxLotBbl400Schema,
  findZoningDistrictClassesByTaxLotBbl404Schema,
  findZoningDistrictClassesByTaxLotBbl500Schema,
  findZoningDistrictClassesByTaxLotBblPathParamsSchema,
} from "./findZoningDistrictClassesByTaxLotBblSchema";
import {
  findZoningDistrictByZoningDistrictIdQueryResponseSchema,
  findZoningDistrictByZoningDistrictId400Schema,
  findZoningDistrictByZoningDistrictId404Schema,
  findZoningDistrictByZoningDistrictId500Schema,
  findZoningDistrictByZoningDistrictIdPathParamsSchema,
} from "./findZoningDistrictByZoningDistrictIdSchema";
import {
  findZoningDistrictClassesByZoningDistrictIdQueryResponseSchema,
  findZoningDistrictClassesByZoningDistrictId400Schema,
  findZoningDistrictClassesByZoningDistrictId404Schema,
  findZoningDistrictClassesByZoningDistrictId500Schema,
  findZoningDistrictClassesByZoningDistrictIdPathParamsSchema,
} from "./findZoningDistrictClassesByZoningDistrictIdSchema";
import {
  findZoningDistrictClassesQueryResponseSchema,
  findZoningDistrictClasses400Schema,
  findZoningDistrictClasses500Schema,
} from "./findZoningDistrictClassesSchema";
import {
  findZoningDistrictClassCategoryColorsQueryResponseSchema,
  findZoningDistrictClassCategoryColors400Schema,
  findZoningDistrictClassCategoryColors500Schema,
} from "./findZoningDistrictClassCategoryColorsSchema";
import {
  findZoningDistrictClassByZoningDistrictClassIdQueryResponseSchema,
  findZoningDistrictClassByZoningDistrictClassId400Schema,
  findZoningDistrictClassByZoningDistrictClassId404Schema,
  findZoningDistrictClassByZoningDistrictClassId500Schema,
  findZoningDistrictClassByZoningDistrictClassIdPathParamsSchema,
} from "./findZoningDistrictClassByZoningDistrictClassIdSchema";

export const operations = {
  findAgencies: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findAgenciesQueryResponseSchema,
      400: findAgencies400Schema,
      500: findAgencies500Schema,
    },
  },
  findBoroughs: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findBoroughsQueryResponseSchema,
      400: findBoroughs400Schema,
      500: findBoroughs500Schema,
    },
  },
  findCommunityDistrictsByBoroughId: {
    request: undefined,
    parameters: {
      path: findCommunityDistrictsByBoroughIdPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findCommunityDistrictsByBoroughIdQueryResponseSchema,
      400: findCommunityDistrictsByBoroughId400Schema,
      404: findCommunityDistrictsByBoroughId404Schema,
      500: findCommunityDistrictsByBoroughId500Schema,
    },
  },
  findCapitalProjectsByBoroughIdCommunityDistrictId: {
    request: undefined,
    parameters: {
      path: findCapitalProjectsByBoroughIdCommunityDistrictIdPathParamsSchema,
      query: findCapitalProjectsByBoroughIdCommunityDistrictIdQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema,
      400: findCapitalProjectsByBoroughIdCommunityDistrictId400Schema,
      404: findCapitalProjectsByBoroughIdCommunityDistrictId404Schema,
      500: findCapitalProjectsByBoroughIdCommunityDistrictId500Schema,
    },
  },
  findCapitalCommitmentsByManagingCodeCapitalProjectId: {
    request: undefined,
    parameters: {
      path: findCapitalCommitmentsByManagingCodeCapitalProjectIdPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponseSchema,
      400: findCapitalCommitmentsByManagingCodeCapitalProjectId400Schema,
      404: findCapitalCommitmentsByManagingCodeCapitalProjectId404Schema,
      500: findCapitalCommitmentsByManagingCodeCapitalProjectId500Schema,
    },
  },
  findCapitalProjectGeoJsonByManagingCodeCapitalProjectId: {
    request: undefined,
    parameters: {
      path: findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdQueryResponseSchema,
      400: findCapitalProjectGeoJsonByManagingCodeCapitalProjectId400Schema,
      404: findCapitalProjectGeoJsonByManagingCodeCapitalProjectId404Schema,
      500: findCapitalProjectGeoJsonByManagingCodeCapitalProjectId500Schema,
    },
  },
  findCapitalProjectByManagingCodeCapitalProjectId: {
    request: undefined,
    parameters: {
      path: findCapitalProjectByManagingCodeCapitalProjectIdPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findCapitalProjectByManagingCodeCapitalProjectIdQueryResponseSchema,
      400: findCapitalProjectByManagingCodeCapitalProjectId400Schema,
      404: findCapitalProjectByManagingCodeCapitalProjectId404Schema,
      500: findCapitalProjectByManagingCodeCapitalProjectId500Schema,
    },
  },
  findCapitalProjectTiles: {
    request: undefined,
    parameters: {
      path: findCapitalProjectTilesPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findCapitalProjectTilesQueryResponseSchema,
      400: findCapitalProjectTiles400Schema,
      500: findCapitalProjectTiles500Schema,
    },
  },
  findCityCouncilDistricts: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findCityCouncilDistrictsQueryResponseSchema,
      400: findCityCouncilDistricts400Schema,
      500: findCityCouncilDistricts500Schema,
    },
  },
  findCapitalProjectsByCityCouncilId: {
    request: undefined,
    parameters: {
      path: findCapitalProjectsByCityCouncilIdPathParamsSchema,
      query: findCapitalProjectsByCityCouncilIdQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: findCapitalProjectsByCityCouncilIdQueryResponseSchema,
      400: findCapitalProjectsByCityCouncilId400Schema,
      404: findCapitalProjectsByCityCouncilId404Schema,
      500: findCapitalProjectsByCityCouncilId500Schema,
    },
  },
  findCityCouncilDistrictTiles: {
    request: undefined,
    parameters: {
      path: findCityCouncilDistrictTilesPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findCityCouncilDistrictTilesQueryResponseSchema,
      400: findCityCouncilDistrictTiles400Schema,
      500: findCityCouncilDistrictTiles500Schema,
    },
  },
  findCommunityDistrictTiles: {
    request: undefined,
    parameters: {
      path: findCommunityDistrictTilesPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findCommunityDistrictTilesQueryResponseSchema,
      400: findCommunityDistrictTiles400Schema,
      500: findCommunityDistrictTiles500Schema,
    },
  },
  findLandUses: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findLandUsesQueryResponseSchema,
      400: findLandUses400Schema,
      500: findLandUses500Schema,
    },
  },
  findTaxLots: {
    request: undefined,
    parameters: {
      path: undefined,
      query: findTaxLotsQueryParamsSchema,
      header: undefined,
    },
    responses: {
      200: findTaxLotsQueryResponseSchema,
      400: findTaxLots400Schema,
      500: findTaxLots500Schema,
    },
  },
  findTaxLotByBbl: {
    request: undefined,
    parameters: {
      path: findTaxLotByBblPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findTaxLotByBblQueryResponseSchema,
      400: findTaxLotByBbl400Schema,
      404: findTaxLotByBbl404Schema,
      500: findTaxLotByBbl500Schema,
    },
  },
  findTaxLotGeoJsonByBbl: {
    request: undefined,
    parameters: {
      path: findTaxLotGeoJsonByBblPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findTaxLotGeoJsonByBblQueryResponseSchema,
      400: findTaxLotGeoJsonByBbl400Schema,
      404: findTaxLotGeoJsonByBbl404Schema,
      500: findTaxLotGeoJsonByBbl500Schema,
    },
  },
  findZoningDistrictsByTaxLotBbl: {
    request: undefined,
    parameters: {
      path: findZoningDistrictsByTaxLotBblPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findZoningDistrictsByTaxLotBblQueryResponseSchema,
      400: findZoningDistrictsByTaxLotBbl400Schema,
      404: findZoningDistrictsByTaxLotBbl404Schema,
      500: findZoningDistrictsByTaxLotBbl500Schema,
    },
  },
  findZoningDistrictClassesByTaxLotBbl: {
    request: undefined,
    parameters: {
      path: findZoningDistrictClassesByTaxLotBblPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findZoningDistrictClassesByTaxLotBblQueryResponseSchema,
      400: findZoningDistrictClassesByTaxLotBbl400Schema,
      404: findZoningDistrictClassesByTaxLotBbl404Schema,
      500: findZoningDistrictClassesByTaxLotBbl500Schema,
    },
  },
  findZoningDistrictByZoningDistrictId: {
    request: undefined,
    parameters: {
      path: findZoningDistrictByZoningDistrictIdPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findZoningDistrictByZoningDistrictIdQueryResponseSchema,
      400: findZoningDistrictByZoningDistrictId400Schema,
      404: findZoningDistrictByZoningDistrictId404Schema,
      500: findZoningDistrictByZoningDistrictId500Schema,
    },
  },
  findZoningDistrictClassesByZoningDistrictId: {
    request: undefined,
    parameters: {
      path: findZoningDistrictClassesByZoningDistrictIdPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findZoningDistrictClassesByZoningDistrictIdQueryResponseSchema,
      400: findZoningDistrictClassesByZoningDistrictId400Schema,
      404: findZoningDistrictClassesByZoningDistrictId404Schema,
      500: findZoningDistrictClassesByZoningDistrictId500Schema,
    },
  },
  findZoningDistrictClasses: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findZoningDistrictClassesQueryResponseSchema,
      400: findZoningDistrictClasses400Schema,
      500: findZoningDistrictClasses500Schema,
    },
  },
  findZoningDistrictClassCategoryColors: {
    request: undefined,
    parameters: {
      path: undefined,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findZoningDistrictClassCategoryColorsQueryResponseSchema,
      400: findZoningDistrictClassCategoryColors400Schema,
      500: findZoningDistrictClassCategoryColors500Schema,
    },
  },
  findZoningDistrictClassByZoningDistrictClassId: {
    request: undefined,
    parameters: {
      path: findZoningDistrictClassByZoningDistrictClassIdPathParamsSchema,
      query: undefined,
      header: undefined,
    },
    responses: {
      200: findZoningDistrictClassByZoningDistrictClassIdQueryResponseSchema,
      400: findZoningDistrictClassByZoningDistrictClassId400Schema,
      404: findZoningDistrictClassByZoningDistrictClassId404Schema,
      500: findZoningDistrictClassByZoningDistrictClassId500Schema,
    },
  },
} as const;
export const paths = {
  "/agencies": {
    get: operations["findAgencies"],
  },
  "/boroughs": {
    get: operations["findBoroughs"],
  },
  "/boroughs/{boroughId}/community-districts": {
    get: operations["findCommunityDistrictsByBoroughId"],
  },
  "/boroughs/{boroughId}/community-districts/{communityDistrictId}/capital-projects":
    {
      get: operations["findCapitalProjectsByBoroughIdCommunityDistrictId"],
    },
  "/capital-projects/{managingCode}/{capitalProjectId}/capital-commitments": {
    get: operations["findCapitalCommitmentsByManagingCodeCapitalProjectId"],
  },
  "/capital-projects/{managingCode}/{capitalProjectId}/geojson": {
    get: operations["findCapitalProjectGeoJsonByManagingCodeCapitalProjectId"],
  },
  "/capital-projects/{managingCode}/{capitalProjectId}": {
    get: operations["findCapitalProjectByManagingCodeCapitalProjectId"],
  },
  "/capital-projects/{z}/{x}/{y}.pbf": {
    get: operations["findCapitalProjectTiles"],
  },
  "/city-council-districts": {
    get: operations["findCityCouncilDistricts"],
  },
  "/city-council-districts/{cityCouncilDistrictId}/capital-projects": {
    get: operations["findCapitalProjectsByCityCouncilId"],
  },
  "/city-council-districts/{z}/{x}/{y}.pbf": {
    get: operations["findCityCouncilDistrictTiles"],
  },
  "/community-districts/{z}/{x}/{y}.pbf": {
    get: operations["findCommunityDistrictTiles"],
  },
  "/land-uses": {
    get: operations["findLandUses"],
  },
  "/tax-lots": {
    get: operations["findTaxLots"],
  },
  "/tax-lots/{bbl}": {
    get: operations["findTaxLotByBbl"],
  },
  "/tax-lots/{bbl}/geojson": {
    get: operations["findTaxLotGeoJsonByBbl"],
  },
  "/tax-lots/{bbl}/zoning-districts": {
    get: operations["findZoningDistrictsByTaxLotBbl"],
  },
  "/tax-lots/{bbl}/zoning-districts/classes": {
    get: operations["findZoningDistrictClassesByTaxLotBbl"],
  },
  "/zoning-districts/{id}": {
    get: operations["findZoningDistrictByZoningDistrictId"],
  },
  "/zoning-districts/{id}/classes": {
    get: operations["findZoningDistrictClassesByZoningDistrictId"],
  },
  "/zoning-district-classes": {
    get: operations["findZoningDistrictClasses"],
  },
  "/zoning-district-classes/category-colors": {
    get: operations["findZoningDistrictClassCategoryColors"],
  },
  "/zoning-district-classes/{id}": {
    get: operations["findZoningDistrictClassByZoningDistrictClassId"],
  },
} as const;
