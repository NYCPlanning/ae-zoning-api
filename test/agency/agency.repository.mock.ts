import {
  CheckByInitialsRepo,
  FindManyRepo,
} from "src/agency/agency.repository.schema";
import { generateMock } from "@anatine/zod-mock";
import { agencyEntitySchema } from "src/schema";

export class AgencyRepositoryMock {
  agencies = Array.from(Array(2), (_, index) =>
    generateMock(agencyEntitySchema, { seed: index + 1 }),
  );

  async checkByInitials(managingAgency: string): Promise<CheckByInitialsRepo> {
    // override so cbbr tests work correctly
    if (managingAgency === "DOHMH") return true;

    return this.agencies.some((row) => row.initials === managingAgency);
  }

  async findMany(): Promise<FindManyRepo> {
    return this.agencies;
  }
}
