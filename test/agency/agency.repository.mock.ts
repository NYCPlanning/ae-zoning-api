import {
  CheckByInitialsRepo,
  FindManyRepo,
} from "src/agency/agency.repository.schema";
import { generateMock } from "@anatine/zod-mock";
import { z } from "zod";
import { agencyEntitySchema } from "src/schema";

export class AgencyRepositoryMock {
  agencies = generateMock(z.array(agencyEntitySchema));

  async checkByInitials(
    managingAgency: string,
  ): Promise<CheckByInitialsRepo | undefined> {
    return this.agencies.some((row) => row.initials === managingAgency);
  }

  async findMany(): Promise<FindManyRepo> {
    return this.agencies;
  }
}
