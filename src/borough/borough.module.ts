import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Borough } from "./borough.entity";
import { BoroughService } from "./borough.service";
import { BoroughController } from "./borough.controller";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Borough] })],
  exports: [BoroughService],
  providers: [BoroughService],
  controllers: [BoroughController],
})
export class BoroughModule {}
