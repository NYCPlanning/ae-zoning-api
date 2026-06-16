import { Inject, Injectable } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { eq, or, sql } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import { FindByIdRepo, FindDomainRepo } from "./facility.repository.schema";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  agency,
  dataSource,
  DataSourceEntitySchema,
  facility,
  facilityGroup,
  facilityOperator,
  facilitySubgroup,
  facilityType,
} from "src/schema";
import { FindFacilityByIdPathParams } from "src/gen";
import { alias } from "drizzle-orm/pg-core";

@Injectable()
export class FacilityRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findById({
    facilityId,
  }: FindFacilityByIdPathParams): Promise<FindByIdRepo | undefined> {
    try {
      const alsoAtLocation = alias(facility, "alsoAtLocation");

      const result = await this.db
        .select({
          id: facility.id,
          name: facility.name,
          address: sql<string>`
            CASE 
              WHEN ${facility.address} IS NOT NULL AND ${facility.zipCode} IS NOT NULL 
                THEN CONCAT(${facility.address}, ', ', ${facility.city}, ', NY ', ${facility.zipCode})
              WHEN ${facility.address} IS NOT NULL 
                THEN CONCAT(${facility.address}, ', ', ${facility.city}, ', NY')
              WHEN ${facility.zipCode} IS NOT NULL 
                THEN CONCAT(${facility.city}, ', NY ', ${facility.zipCode})
              WHEN ${facility.city} IS NOT NULL 
                THEN CONCAT(${facility.city}, ', NY')
              ELSE 'NY'
            END
          `,
          bin: facility.bin,
          bbl: facility.bbl,
          oversightAgencyInitials: facility.overseeingAgencyInitials,
          facilityJurisdiction: agency.oversightLevel,
          facilityOperatorType: facilityOperator.type,
          operatorName: facilityOperator.name,
          categoryId: facilityGroup.facilityDomainId,
          categoryGroupId: facilityGroup.id,
          categorySubgroupId: facilitySubgroup.id,
          dataSource: sql<DataSourceEntitySchema>`
            json_build_object(
              'schemaName', ${dataSource.schemaName},
              'datasetName', ${dataSource.datasetName},
              'version', ${dataSource.version},
              'retreiveDate', ${dataSource.retrieveDate}
            )
          `.as("dataSource"),
          alsoAtLocation: sql<any[]>`
            COALESCE(
              jsonb_agg(
                jsonb_build_object(
                  'id', ${alsoAtLocation.id},
                  'name', ${alsoAtLocation.name}
                )
              ) FILTER (WHERE ${alsoAtLocation.id} <> ${facility.id}), 
              '[]'::jsonb
            )`.as("alsoAtLocation"),
        })
        .from(facility)
        .leftJoin(
          agency,
          eq(agency.initials, facility.overseeingAgencyInitials),
        )
        .leftJoin(
          facilityOperator,
          eq(facilityOperator.id, facility.facilityOperatorId),
        )
        .leftJoin(facilityType, eq(facilityType.id, facility.facilityTypeId))
        .leftJoin(
          facilitySubgroup,
          eq(facilitySubgroup.id, facilityType.facilitySubgroupId),
        )
        .leftJoin(
          facilityGroup,
          eq(facilityGroup.id, facilitySubgroup.facilityGroupId),
        )
        .leftJoin(
          dataSource,
          eq(dataSource.schemaName, facility.dataSourceSchema),
        )
        .leftJoin(
          alsoAtLocation,
          or(
            eq(facility.bin, alsoAtLocation.bin),
            eq(facility.bbl, alsoAtLocation.bbl),
          ),
        )
        .where(eq(facility.id, facilityId))
        .limit(1)
        .groupBy(
          facility.id,
          facility.name,
          facility.bbl,
          facility.bin,
          facility.overseeingAgencyInitials,
          agency.oversightLevel,
          facilityOperator.type,
          facilityOperator.name,
          facilityGroup.facilityDomainId,
          facilityGroup.id,
          facilitySubgroup.id,
          dataSource.schemaName,
          dataSource.datasetName,
          dataSource.version,
          dataSource.retrieveDate,
        );

      return result.length > 0 ? result[0] : undefined;
    } catch {
      throw new DataRetrievalException("Cannot find Facility with given id");
    }
  }

  async findCategories(): Promise<FindDomainRepo> {
    try {
      return await this.db.query.facilityDomain.findMany({
        with: {
          groups: {
            with: {
              subgroups: true,
            },
          },
        },
      });
    } catch {
      throw new DataRetrievalException("cannot find facilities");
    }
  }
}
