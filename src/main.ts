import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set("query parser", "extended");
  app.enableCors();
  app.setGlobalPrefix("api");

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
