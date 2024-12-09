import { Inject, Injectable } from "@nestjs/common";
import { BoroughRepository } from "./borough.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { ResourceNotFoundException } from "src/exception";
import {
  FindBoroughGeoJsonByBoroughIdPathParams,
  FindCapitalProjectsByBoroughIdCommunityDistrictIdPathParams,
  FindCapitalProjectsByBoroughIdCommunityDistrictIdQueryParams,
  FindCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParams,
} from "src/gen";
import { produce } from "immer";
import {
  BoroughGeoJsonEntity,
  CommunityDistrictGeoJsonEntity,
} from "./borough.repository.schema";
import { BoroughEntity, CommunityDistrictEntity } from "src/schema";

@Injectable()
export class BoroughService {
  constructor(
    @Inject(BoroughRepository)
    private readonly boroughRepository: BoroughRepository,
    @Inject(CommunityDistrictRepository)
    private readonly communityDistrictRepository: CommunityDistrictRepository,
  ) {}

  async findMany() {
    const boroughs = await this.boroughRepository.findMany();
    return {
      boroughs,
    };
  }

  async findGeoJsonById(params: FindBoroughGeoJsonByBoroughIdPathParams) {
    const boroughSpatial = await this.boroughRepository.findSpatialById(params);
    if (boroughSpatial === undefined) throw new ResourceNotFoundException();

    const geometry = JSON.parse(boroughSpatial.geometry);
    const properties = produce(
      boroughSpatial as Partial<BoroughGeoJsonEntity>,
      (draft) => {
        delete draft["geometry"];
      },
    ) as BoroughEntity;

    return {
      type: "Feature",
      id: boroughSpatial.id,
      properties,
      geometry,
    };
  }

  async findCommunityDistrictsByBoroughId(id: string) {
    const boroughCheck = await this.boroughRepository.checkBoroughById(id);
    if (boroughCheck === undefined) throw new ResourceNotFoundException();

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
      throw new ResourceNotFoundException();

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

  async findCapitalProjectsByBoroughIdCommunityDistrictId({
    boroughId,
    communityDistrictId,
    limit = 20,
    offset = 0,
  }: FindCapitalProjectsByBoroughIdCommunityDistrictIdPathParams &
    FindCapitalProjectsByBoroughIdCommunityDistrictIdQueryParams) {
    const boroughCheck =
      await this.boroughRepository.checkBoroughById(boroughId);
    if (boroughCheck === undefined) throw new ResourceNotFoundException();

    const communityDistrictCheck =
      await this.communityDistrictRepository.checkCommunityDistrictById(
        communityDistrictId,
      );
    if (communityDistrictCheck === undefined)
      throw new ResourceNotFoundException();

    const capitalProjects =
      await this.boroughRepository.findCapitalProjectsByBoroughIdCommunityDistrictId(
        {
          boroughId,
          communityDistrictId,
          limit,
          offset,
        },
      );

    return {
      limit,
      offset,
      total: capitalProjects.length,
      order: "managingCode, capitalProjectId",
      capitalProjects,
    };
  }

  async findCapitalProjectTilesByBoroughIdCommunityDistrictId(
    params: FindCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParams,
  ) {
    return this.boroughRepository.findCapitalProjectTilesByBoroughIdCommunityDistrictId(
      params,
    );
  }
}
