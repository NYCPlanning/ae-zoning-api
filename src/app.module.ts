import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as Joi from "joi";
import { join } from "path";
import { BoroughModule } from "./borough/borough.module";
import { LandUseModule } from "./land-use/land-use.module";
import { TaxLotModule } from "./tax-lot/tax-lot.module";
import { ZoningDistrictModule } from "./zoning-district/zoning-district.module";
import { DbConfig, FeatureFlagConfig } from "./config";
import { GlobalModule } from "./global/global.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DbConfig, FeatureFlagConfig],
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
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgresql",
        dbName: configService.get("DATABASE_NAME"),
        user: configService.get("DATABASE_USER"),
        password: configService.get("DATABASE_PASSWORD"),
        host: configService.get("DATABASE_HOST"),
        port: configService.get("DATABASE_PORT"),
        entities: ["dist/**/*.entity.js"],
        entitiesTs: ["src/**/*.entity.ts"],
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "openapi"),
      exclude: ["/api/(.*)"],
    }),
    GlobalModule,
    BoroughModule,
    LandUseModule,
    TaxLotModule,
    ZoningDistrictModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
