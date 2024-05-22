import {
  Controller,
  Get,
  Injectable,
  Param,
  // Redirect,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { CommunityDistrictService } from "./community-district.service";
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
export class CommunityDistrictController {
  constructor(private readonly communityDistrictService: CommunityDistrictService) {}

  @Get("/:boroughId/community-districts")
  @UsePipes(
    new ZodValidationPipe(
      findCommunityDistrictsByBoroughIdPathParamsSchema,
    ),
  )
  async findCommunityDistrictsById(
    @Param() params: FindCommunityDistrictsByBoroughIdPathParams,
  ) {
    return this.communityDistrictService.findCommunityDistrictsByBoroughId(params.boroughId);
  }

}
