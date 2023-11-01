import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as Joi from "joi";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
