import { Inject, Injectable } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { and, eq, inArray, isNotNull, isNull, or, sql } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import {
  FindAgenciesRepo,
  FindByIdRepo,
  FindDomainRepo,
  FindManyRepo,
  FindTilesRepo,
} from "./facility.repository.schema";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  agency,
  borough,
  cityCouncilDistrict,
  communityDistrict,
  dataSource,
  DataSourceEntitySchema,
  facility,
  facilityGroup,
  facilityOperator,
  facilitySubgroup,
  facilityType,
} from "src/schema";
import {
  FindFacilityByIdPathParams,
  FindFacilityTilesPathParams,
  OversightLevelCategory,
} from "src/gen";
import { alias } from "drizzle-orm/pg-core";
import { Geom } from "src/types";

@Injectable()
export class FacilityRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findMany({
    boroughIds,
    facilityJurisdictions,
    facilityOperatorTypes,
    facilityOversightAgency,
    facilityCategoryIds,
    facilityGroupIds,
    facilitySubgroupIds,
    communityDistrictIds,
    cityCouncilDistrictIds,
    bbl,
    bin,
    geom,
    buffer,
    limit,
    offset,
  }: {
    boroughIds: Array<string> | null;
    facilityJurisdictions: Array<
      "City" | "County" | "State" | "Federal" | "Not specified"
    > | null;
    facilityOperatorTypes: Array<
      "Public" | "Non-public" | "Not specified"
    > | null;
    facilityOversightAgency: string | null;
    facilityCategoryIds: Array<number> | null;
    facilityGroupIds: Array<number> | null;
    facilitySubgroupIds: Array<number> | null;
    communityDistrictIds: Array<string> | null;
    cityCouncilDistrictIds: Array<string> | null;
    bbl: string | null;
    bin: string | null;
    geom: Geom | null;
    buffer: number;
    limit: number;
    offset: number;
  }): Promise<FindManyRepo> {
    try {
      return await this.db
        .select({
          id: facility.id,
          name: facility.name,
          oversightAgencyInitials: agency.initials,
          categoryId: facilityGroup.facilityDomainId,
          hasSogrData: sql<boolean>`${isNotNull(facility.sgrLtr)}`,
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
          borough,
          and(
            sql`${boroughIds !== null} IS TRUE`,
            sql`ST_Intersects(${borough.liFt}, ${facility.liFt})`,
          ),
        )
        .leftJoin(
          communityDistrict,
          and(
            sql`${communityDistrictIds !== null} IS TRUE`,
            sql`ST_Intersects(${communityDistrict.liFt}, ${facility.liFt})`,
          ),
        )
        .leftJoin(
          cityCouncilDistrict,
          and(
            sql`${cityCouncilDistrictIds !== null} IS TRUE`,
            sql`ST_Intersects(${cityCouncilDistrict.liFt}, ${facility.liFt})`,
          ),
        )
        .where(
          and(
            or(
              facilityCategoryIds !== null
                ? inArray(facilityGroup.facilityDomainId, facilityCategoryIds)
                : undefined,
              facilityGroupIds !== null
                ? inArray(facilityGroup.id, facilityGroupIds)
                : undefined,
              facilitySubgroupIds !== null
                ? inArray(facilitySubgroup.id, facilitySubgroupIds)
                : undefined,
            ),
            bbl !== null ? eq(facility.bbl, bbl) : undefined,
            bin !== null ? eq(facility.bin, bin) : undefined,
            facilityJurisdictions !== null
              ? or(
                  inArray(agency.oversightLevel, facilityJurisdictions),
                  facilityJurisdictions.includes("Not specified")
                    ? isNull(agency.oversightLevel)
                    : undefined,
                )
              : undefined,
            facilityOperatorTypes !== null
              ? or(
                  inArray(facilityOperator.type, facilityOperatorTypes),
                  facilityOperatorTypes.includes("Not specified")
                    ? isNull(facilityOperator.type)
                    : undefined,
                )
              : undefined,
            facilityOversightAgency !== null
              ? eq(facility.overseeingAgencyInitials, facilityOversightAgency)
              : undefined,
            boroughIds !== null ? inArray(borough.id, boroughIds) : undefined,
            communityDistrictIds !== null
              ? inArray(
                  sql<string>`${communityDistrict.boroughId}||${communityDistrict.id}`,
                  communityDistrictIds,
                )
              : undefined,
            cityCouncilDistrictIds !== null
              ? inArray(cityCouncilDistrict.id, cityCouncilDistrictIds)
              : undefined,
            geom !== null
              ? sql`ST_DWithin(${geom}, ${facility.liFt}, ${buffer})`
              : undefined,
          ),
        )
        .limit(limit)
        .offset(offset)
        .orderBy(
          sql`CASE
              WHEN ${geom !== null && isNotNull(facility.liFt)} THEN ${geom} <-> ${facility.liFt}
            END`,
          facility.id,
        );
    } catch {
      throw new DataRetrievalException("Cannot find facilities");
    }
  }

  async findCount({
    boroughIds,
    facilityJurisdictions,
    facilityOperatorTypes,
    facilityOversightAgency,
    facilityCategoryIds,
    facilityGroupIds,
    facilitySubgroupIds,
    communityDistrictIds,
    cityCouncilDistrictIds,
    bbl,
    bin,
    geom,
    buffer,
  }: {
    boroughIds: Array<string> | null;
    facilityJurisdictions: Array<
      "City" | "County" | "State" | "Federal" | "Not specified"
    > | null;
    facilityOperatorTypes: Array<
      "Public" | "Non-public" | "Not specified"
    > | null;
    facilityOversightAgency: string | null;
    facilityCategoryIds: Array<number> | null;
    facilityGroupIds: Array<number> | null;
    facilitySubgroupIds: Array<number> | null;
    communityDistrictIds: Array<string> | null;
    cityCouncilDistrictIds: Array<string> | null;
    bbl: string | null;
    bin: string | null;
    geom: Geom | null;
    buffer: number;
  }): Promise<number> {
    try {
      const results = await this.db
        .select({
          total: sql`COUNT(DISTINCT(${facility.id}))`.mapWith(Number),
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
          borough,
          and(
            sql`${boroughIds !== null} IS TRUE`,
            sql`ST_Intersects(${borough.liFt}, ${facility.liFt})`,
          ),
        )
        .leftJoin(
          communityDistrict,
          and(
            sql`${communityDistrictIds !== null} IS TRUE`,
            sql`ST_Intersects(${communityDistrict.liFt}, ${facility.liFt})`,
          ),
        )
        .leftJoin(
          cityCouncilDistrict,
          and(
            sql`${cityCouncilDistrictIds !== null} IS TRUE`,
            sql`ST_Intersects(${cityCouncilDistrict.liFt}, ${facility.liFt})`,
          ),
        )
        .where(
          and(
            or(
              facilityCategoryIds !== null
                ? inArray(facilityGroup.facilityDomainId, facilityCategoryIds)
                : undefined,
              facilityGroupIds !== null
                ? inArray(facilityGroup.id, facilityGroupIds)
                : undefined,
              facilitySubgroupIds !== null
                ? inArray(facilitySubgroup.id, facilitySubgroupIds)
                : undefined,
            ),
            bbl !== null ? eq(facility.bbl, bbl) : undefined,
            bin !== null ? eq(facility.bin, bin) : undefined,
            facilityJurisdictions !== null
              ? or(
                  inArray(agency.oversightLevel, facilityJurisdictions),
                  facilityJurisdictions.includes("Not specified")
                    ? isNull(agency.oversightLevel)
                    : undefined,
                )
              : undefined,
            facilityOperatorTypes !== null
              ? or(
                  inArray(facilityOperator.type, facilityOperatorTypes),
                  facilityOperatorTypes.includes("Not specified")
                    ? isNull(facilityOperator.type)
                    : undefined,
                )
              : undefined,
            facilityOversightAgency !== null
              ? eq(facility.overseeingAgencyInitials, facilityOversightAgency)
              : undefined,
            boroughIds !== null ? inArray(borough.id, boroughIds) : undefined,
            communityDistrictIds !== null
              ? inArray(
                  sql<string>`${communityDistrict.boroughId}||${communityDistrict.id}`,
                  communityDistrictIds,
                )
              : undefined,
            cityCouncilDistrictIds !== null
              ? inArray(cityCouncilDistrict.id, cityCouncilDistrictIds)
              : undefined,
            geom !== null
              ? sql`ST_DWithin(${geom}, ${facility.liFt}, ${buffer})`
              : undefined,
          ),
        );
      return results[0].total;
    } catch {
      throw new DataRetrievalException("Cannot find Facilities count");
    }
  }

  async findById({
    facilityId,
  }: FindFacilityByIdPathParams): Promise<FindByIdRepo> {
    try {
      const alsoAtLocation = alias(facility, "alsoAtLocation");
      const alsoAtLocationType = alias(facilityType, "alsoAtLocationType");
      const alsoAtLocationSubgroup = alias(
        facilitySubgroup,
        "alsoAtLocationSubgroup",
      );
      const alsoAtLocationGroup = alias(facilityGroup, "alsoAtLocationGroup");

      return await this.db
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
          position: sql<[number, number]>`
            ARRAY[
              ST_X(ST_Transform(ST_Centroid(${facility.liFt}), 4326)),
              ST_Y(ST_Transform(ST_Centroid(${facility.liFt}), 4326))
            ]
          `,
          dataSource: sql<DataSourceEntitySchema>`
            json_build_object(
              'schemaName', ${dataSource.schemaName},
              'datasetName', ${dataSource.datasetName},
              'version', ${dataSource.version},
              'retrieveDate', ${dataSource.retrieveDate},
              'url', ${dataSource.url}
            )
          `.as("dataSource"),
          alsoAtLocation: sql<any[]>`
            COALESCE(
              jsonb_agg(
                jsonb_build_object(
                  'id', ${alsoAtLocation.id},
                  'name', ${alsoAtLocation.name},
                  'categoryId', ${alsoAtLocationGroup.facilityDomainId}
                )
              ) FILTER (WHERE ${alsoAtLocation.id} <> ${facility.id}), 
              '[]'::jsonb
            )`.as("alsoAtLocation"),
          sgrLtr: facility.sgrLtr,
          sgrArcLtr: facility.sgrArcLtr,
          sgrSysLtr: facility.sgrSysLtr,
          sgrYear: facility.sgrYear,
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
        .leftJoin(
          alsoAtLocationType,
          eq(alsoAtLocationType.id, alsoAtLocation.facilityTypeId),
        )
        .leftJoin(
          alsoAtLocationSubgroup,
          eq(alsoAtLocationSubgroup.id, alsoAtLocationType.facilitySubgroupId),
        )
        .leftJoin(
          alsoAtLocationGroup,
          eq(alsoAtLocationGroup.id, alsoAtLocationSubgroup.facilityGroupId),
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
          dataSource.url,
        );
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
      throw new DataRetrievalException("Cannot find Facilities' categories");
    }
  }

  async findAgencies(): Promise<FindAgenciesRepo> {
    try {
      return await this.db
        .selectDistinct({
          initials: agency.initials,
          name: agency.name,
          oversightLevel: sql<OversightLevelCategory>`${agency.oversightLevel}`,
        })
        .from(agency)
        .leftJoin(
          facility,
          eq(facility.overseeingAgencyInitials, agency.initials),
        )
        .where(isNotNull(facility.overseeingAgencyInitials))
        .orderBy(agency.initials);
    } catch {
      throw new DataRetrievalException("Cannot find facilities' agencies");
    }
  }

  async findTiles({
    z,
    x,
    y,
  }: FindFacilityTilesPathParams): Promise<FindTilesRepo> {
    try {
      const tile = this.db
        .select({
          id: sql`${facility.id}`.as("id"),
          name: sql`${facility.name}`.as("name"),
          oversightAgencyInitials: sql`${facility.overseeingAgencyInitials}`.as(
            "overseeingAgencyInitials",
          ),
          facilityJurisdiction: sql`${agency.oversightLevel}`.as(
            "facilityJurisdiction",
          ),
          facilityOperatorType: sql`${facilityOperator.type}`.as(
            "facilityOperatorType",
          ),
          categoryId: sql`${facilityGroup.facilityDomainId}`.as("categoryId"),
          categoryGroupId: sql`${facilityGroup.id}`.as("categoryGroupId"),
          categorySubgroupId: sql`${facilitySubgroup.id}`.as(
            "categorySubgroupId",
          ),
          geom: sql<string>`
            CASE
              WHEN ${facility.mercator} && ST_TileEnvelope(${z},${x},${y})
                THEN ST_AsMVTGeom(
                  ${facility.mercator},
                  ST_TileEnvelope(${z},${x},${y}),
                  4096,
                  64,
                  true
                )
            END`.as("geom"),
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
        .where(sql`${facility.mercator} && ST_TileEnvelope(${z},${x},${y})`)
        .as("tile");

      const data = await this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'facility', 4096, 'geom')`,
        })
        .from(tile)
        .where(isNotNull(tile.geom));

      const mvt = data[0].mvt;
      return mvt;
    } catch {
      throw new DataRetrievalException("Cannot generate Facility tiles");
    }
  }
}
