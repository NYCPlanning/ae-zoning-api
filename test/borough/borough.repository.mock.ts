import {
  findManyRepoSchema,
  checkByIdRepoSchema,
  findCommunityDistrictsByBoroughIdRepoSchema,
  findCapitalProjectsByBoroughIdCommunityDistrictIdRepoSchema,
  checkByCommunityDistrictIdRepoSchema,
} from "src/borough/borough.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class BoroughRepositoryMock {
  numberOfMocks = 1;

  checkBoroughByIdMocks = Array.from(Array(this.numberOfMocks), (_, seed) =>
    generateMock(checkByIdRepoSchema, { seed: seed + 1 }),
  );

  async checkBoroughById(id: string) {
    return this.checkBoroughByIdMocks.find((row) => row.id === id);
  }

  checkCommunityDistrictByIdMocks = Array.from(
    Array(this.numberOfMocks),
    (_, seed) =>
      generateMock(checkByCommunityDistrictIdRepoSchema, { seed: seed + 1 }),
  );

  async checkCommunityDistrictById(id: string) {
    return this.checkCommunityDistrictByIdMocks.find((row) => row.id === id);
  }

  findManyMocks = generateMock(findManyRepoSchema);

  async findMany() {
    return this.findManyMocks;
  }

  findCommunityDistrictsByBoroughIdMocks = this.checkBoroughByIdMocks.map(
    (checkCommunityDistrict) => {
      return {
        [checkCommunityDistrict.id]: generateMock(
          findCommunityDistrictsByBoroughIdRepoSchema,
        ),
      };
    },
  );

  async findCommunityDistrictsByBoroughId(id: string) {
    const results = this.findCommunityDistrictsByBoroughIdMocks.find(
      (communityDistricts) => id in communityDistricts,
    );

    return results === undefined ? [] : results[id];
  }

  findCapitalProjectsByBoroughIdCommunityDistrictIdMocks =
    this.checkCommunityDistrictByIdMocks.map((checkCommunityDistrict) => {
      return {
        [checkCommunityDistrict.id]: generateMock(
          findCapitalProjectsByBoroughIdCommunityDistrictIdRepoSchema,
        ),
      };
    });
  async findCapitalProjectsByBoroughIdCommunityDistrictId(
    communityDistrictId: string,
  ) {
    const results =
      this.findCapitalProjectsByBoroughIdCommunityDistrictIdMocks.find(
        (capitalProjects) => communityDistrictId in capitalProjects,
      );
    return results == undefined ? [] : results[communityDistrictId];
  }
}
