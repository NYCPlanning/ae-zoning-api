import { Injectable } from "@nestjs/common";
import { CommunityDistrictRepository } from "./community-district.repository";
import { FindCommunityDistrictTilesPathParams } from "src/gen";

@Injectable()
export class CommunityDistrictService {
  constructor(
    private readonly communityDistrictRepository: CommunityDistrictRepository,
  ) {}

  async findTiles(params: FindCommunityDistrictTilesPathParams) {
    return await this.communityDistrictRepository.findTiles(params);
  }

  async findShapefile() {
    const communityDistricts =
      await this.communityDistrictRepository.findShapefile();

    const features = communityDistricts.map((cd) => {
      const geom = JSON.parse(cd.geoJsonString);

      return {
        type: "Feature",
        geometry: { ...geom, type: "MultiPolygon" },
        properties: {
          boro_id: cd.boroughId,
          id: cd.id,
        },
      };
    });

    const featureCollection = {
      type: <string>"FeatureCollection",
      features,
    } as GeoJSON.FeatureCollection;

    return featureCollection;
  }
}
