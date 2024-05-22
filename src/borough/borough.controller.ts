import {
  Controller,
  Get,
  Injectable,
  Param,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { BoroughService } from "./borough.service";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import {
  FindCommunityDistrictsByBoroughIdPathParams,
  findCommunityDistrictsByBoroughIdPathParamsSchema,
} from "src/gen";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";

@Injectable()
@UseFilters(
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
)
@Controller("boroughs")
export class BoroughController {
  constructor(private readonly boroughService: BoroughService) {}

  @Get()
  async findMany() {
    return this.boroughService.findMany();
  }

  @Get("/:boroughId/community-districts")
  @UsePipes(
    new ZodValidationPipe(findCommunityDistrictsByBoroughIdPathParamsSchema),
  )
  async findCommunityDistrictsById(
    @Param() params: FindCommunityDistrictsByBoroughIdPathParams,
  ) {
    return this.boroughService.findCommunityDistrictsByBoroughId(
      params.boroughId,
    );
  }
}
