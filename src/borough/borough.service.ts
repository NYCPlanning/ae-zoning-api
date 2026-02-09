import { Injectable } from "@nestjs/common";
import { BoroughRepository } from "./borough.repository";
import { ResourceNotFoundException } from "src/exception";
import {
  FindBoroughTilesPathParams,
  FindBoroughGeoJsonByBoroughIdPathParams,
  FindCapitalProjectsByBoroughIdCommunityDistrictIdPathParams,
  FindCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParams,
  FindCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictIdPathParams,
} from "src/gen";
import { produce } from "immer";
import {
  BoroughGeoJsonEntity,
  CommunityDistrictGeoJsonEntity,
} from "./borough.repository.schema";
import { BoroughEntity, CommunityDistrictEntity } from "src/schema";
import { MultiPolygon } from "geojson";

@Injectable()
export class BoroughService {
  constructor(private readonly boroughRepository: BoroughRepository) {}

  async findMany() {
    const boroughs = await this.boroughRepository.findMany();
    return {
      boroughs,
    };
  }

  async findTiles(params: FindBoroughTilesPathParams) {
    return await this.boroughRepository.findTiles(params);
  }

  async findGeoJsonById({
    boroughId,
  }: FindBoroughGeoJsonByBoroughIdPathParams) {
    const boroughGeoJson = await this.boroughRepository.findGeoJsonById({
      boroughId,
    });
    if (boroughGeoJson === undefined)
      throw new ResourceNotFoundException("cannot find borough geojson");

    const geometry = JSON.parse(boroughGeoJson.geometry) as MultiPolygon;
    const properties = produce(
      boroughGeoJson as Partial<BoroughGeoJsonEntity>,
      (draft) => {
        delete draft["geometry"];
      },
    ) as BoroughEntity;

    return {
      type: "Feature",
      id: boroughGeoJson.id,
      properties,
      geometry,
    };
  }

  async findCommunityDistrictsByBoroughId(id: string) {
    const boroughCheck = await this.boroughRepository.checkById(id);
    if (boroughCheck === false)
      throw new ResourceNotFoundException(
        "cannot find borough for community districts",
      );

    const communityDistricts =
      await this.boroughRepository.findCommunityDistrictsByBoroughId(id);

    return {
      communityDistricts,
      order: "id",
    };
  }

  async findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId(
    params: FindCapitalProjectsByBoroughIdCommunityDistrictIdPathParams,
  ) {
    const communityDistrictGeoJson =
      await this.boroughRepository.findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId(
        params,
      );
    if (communityDistrictGeoJson === undefined)
      throw new ResourceNotFoundException(
        "cannot find community district geojson",
      );

    const geometry = JSON.parse(communityDistrictGeoJson.geometry);
    const properties = produce(
      communityDistrictGeoJson as Partial<CommunityDistrictGeoJsonEntity>,
      (draft) => {
        delete draft["geometry"];
      },
    ) as CommunityDistrictEntity;

    return {
      type: "Feature",
      id: `${communityDistrictGeoJson.boroughId}${communityDistrictGeoJson.id}`,
      properties,
      geometry,
    };
  }

  async findCapitalProjectTilesByBoroughIdCommunityDistrictId(
    params: FindCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParams,
  ) {
    return this.boroughRepository.findCapitalProjectTilesByBoroughIdCommunityDistrictId(
      params,
    );
  }

  async findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictId(
    params: FindCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictIdPathParams,
  ) {
    return this.boroughRepository.findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictId(
      params,
    );
  }
}
