import {
  findManyRepoSchema,
  checkByIdRepoSchema,
  findCommunityDistrictsByBoroughIdRepoSchema,
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
}
