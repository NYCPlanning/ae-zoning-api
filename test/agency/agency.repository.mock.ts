import {
  CheckByInitialsRepo,
  checkByInitialsRepoSchema,
  findManyRepoSchema,
} from "src/agency/agency.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class AgencyRepositoryMock {
  numberOfMocks = 2;
  findByInitialsMocks = Array.from(Array(this.numberOfMocks), (_, seed) =>
    generateMock(checkByInitialsRepoSchema, {
      seed: seed + 1,
    }),
  );

  async checkByInitials(
    managingAgency: string,
  ): Promise<CheckByInitialsRepo | undefined> {
    return this.findByInitialsMocks.find(
      (row) => row.initials === managingAgency,
    );
  }

  findManyMocks = generateMock(findManyRepoSchema);

  async findMany() {
    return this.findManyMocks;
  }
}
