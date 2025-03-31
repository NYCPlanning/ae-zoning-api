import {
  CheckByInitialsRepo,
  findManyRepoSchema,
} from "src/agency/agency.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class AgencyRepositoryMock {
  findManyMocks = generateMock(findManyRepoSchema);

  async checkByInitials(managingAgency: string): Promise<CheckByInitialsRepo> {
    return this.findManyMocks.some((row) => row.initials === managingAgency);
  }

  async findMany() {
    return this.findManyMocks;
  }
}
