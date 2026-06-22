import { agencyEntitySchema } from "src/schema";
import {
  facilityDomainEntitySchema,
  facilityEntitySchema,
  facilityPageItemEntitySchema,
} from "src/schema/facility";
import { z } from "zod";

export const findManyRepoSchema = z.array(facilityPageItemEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;

export const findByIdRepoSchema = z.array(facilityEntitySchema);

export type FindByIdRepo = z.infer<typeof findByIdRepoSchema>;

export const findDomainRepoSchema = z.array(facilityDomainEntitySchema);

export type FindDomainRepo = z.infer<typeof findDomainRepoSchema>;

export const findAgenciesRepoSchema = z.array(agencyEntitySchema);

export type FindAgenciesRepo = z.infer<typeof findAgenciesRepoSchema>;
