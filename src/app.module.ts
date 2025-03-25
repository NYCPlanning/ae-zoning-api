import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as Joi from "joi";
import { join } from "path";
import { BoroughModule } from "./borough/borough.module";
import { LandUseModule } from "./land-use/land-use.module";
import { TaxLotModule } from "./tax-lot/tax-lot.module";
import { ZoningDistrictModule } from "./zoning-district/zoning-district.module";
import { DbConfig, FeatureFlagConfig, StorageConfig } from "./config";
import { GlobalModule } from "./global/global.module";
import { ZoningDistrictClassModule } from "./zoning-district-class/zoning-district-class.module";
import { AgencyModule } from "./agency/agency.module";
import { CityCouncilDistrictModule } from "./city-council-district/city-council-district.module";
import { CapitalProjectModule } from "./capital-project/capital-project.module";
import { CommunityDistrictModule } from "./community-district/community-district.module";
import { CapitalCommitmentTypeModule } from "./capital-commitment-type/capital-commitment-type.module";
import { AgencyBudgetModule } from "./agency-budget/agency-budget.module";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DbConfig, FeatureFlagConfig, StorageConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid("development", "production", "test"),
        DATABASE_HOST: Joi.string(),
        DATABASE_NAME: Joi.string(),
        DATABASE_PASSWORD: Joi.string(),
        DATABASE_PORT: Joi.number(),
        DATABASE_USER: Joi.string(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "openapi"),
      exclude: ["/api/(.*)"],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 2.16e7,
    }),
    GlobalModule,
    AgencyModule,
    AgencyBudgetModule,
    BoroughModule,
    CityCouncilDistrictModule,
    CapitalCommitmentTypeModule,
    CapitalProjectModule,
    CommunityDistrictModule,
    LandUseModule,
    TaxLotModule,
    ZoningDistrictModule,
    ZoningDistrictClassModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
