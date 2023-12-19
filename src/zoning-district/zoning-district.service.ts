import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { ZoningDistrict } from "./zoning-district.entity";
import { ZoningDistrictRepository } from "./zoning-district.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { DB, DbType } from "src/global/providers/db.provider";
import {
  zoningDistrict,
  zoningDistrictClass,
  zoningDistrictZoningDistrictClass,
} from "src/schema";
import { eq } from "drizzle-orm";
import { SelectZoningDistrict } from "src/schema/zoning-district";
import {
  DataRetrievalException,
  ResourceNotFoundException,
} from "src/exception";

@Injectable()
export class ZoningDistrictService {
  constructor(
    @Inject(DB)
    private readonly db: DbType,

    @InjectRepository(ZoningDistrict)
    private readonly zoningDistrictRepository: ZoningDistrictRepository,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findZoningDistrictByUuid(uuid: string) {
    if (this.featureFlagConfig.useDrizzle) {
      let result: SelectZoningDistrict | undefined;
      try {
        result = await this.db.query.zoningDistrict.findFirst({
          columns: { wgs84: false, liFt: false },
          where: eq(zoningDistrict.id, uuid),
        });
      } catch {
        throw new DataRetrievalException();
      }
      if (result === undefined) throw new ResourceNotFoundException();
      return result;
    } else {
      return this.zoningDistrictRepository.findOne(uuid, {
        fields: ["id", "label"],
      });
    }
  }

  #checkZoningDistrictById = this.db.query.zoningDistrict
    .findFirst({
      columns: {
        id: true,
      },
      where: (zoningDistrict, { eq, sql }) =>
        eq(zoningDistrict.id, sql.placeholder("id")),
    })
    .prepare("checkZoningDistrictById");

  async findClassesByZoningDistrictUuid(id: string) {
    if (this.featureFlagConfig.useDrizzle) {
      let zoningDistrictCheck: Pick<SelectZoningDistrict, "id"> | undefined;
      try {
        zoningDistrictCheck = await this.#checkZoningDistrictById.execute({
          id,
        });
      } catch {
        throw new DataRetrievalException();
      }
      if (zoningDistrictCheck === undefined)
        throw new ResourceNotFoundException();

      try {
        const zoningDistrictClasses = await this.db
          .select({
            id: zoningDistrictClass.id,
            category: zoningDistrictClass.category,
            description: zoningDistrictClass.description,
            url: zoningDistrictClass.url,
            color: zoningDistrictClass.color,
          })
          .from(zoningDistrictClass)
          .leftJoin(
            zoningDistrictZoningDistrictClass,
            eq(
              zoningDistrictZoningDistrictClass.zoningDistrictClassId,
              zoningDistrictClass.id,
            ),
          )
          .leftJoin(
            zoningDistrict,
            eq(
              zoningDistrictZoningDistrictClass.zoningDistrictId,
              zoningDistrict.id,
            ),
          )
          .where(eq(zoningDistrict.id, id));

        return {
          zoningDistrictClasses,
        };
      } catch {
        throw new DataRetrievalException();
      }
    } else {
      throw new Error(
        "Zoning District Classes route not supported in Mikro ORM",
      );
    }
  }
}
