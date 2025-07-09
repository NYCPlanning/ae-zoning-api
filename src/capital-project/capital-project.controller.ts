import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  Res,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { Response } from "express";
import {
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectTilesPathParams,
  FindCapitalProjectsQueryParams,
  findCapitalCommitmentsByManagingCodeCapitalProjectIdPathParamsSchema,
  findCapitalProjectByManagingCodeCapitalProjectIdPathParamsSchema,
  findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParamsSchema,
  findCapitalProjectTilesPathParamsSchema,
} from "src/gen";
import { CapitalProjectService } from "./capital-project.service";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";
import { findCapitalProjectsQueryParamsSchema } from "src/gen/zod/findCapitalProjectsSchema";
import { unparse } from "papaparse";
import { z } from "zod";

export const findCsvUrlQueryParams = z.object({
  communityDistrictId: z.string().optional(),
  cityCouncilDistrictId: z.string().optional(),
  managingAgency: z.string().optional(),
  agencyBudget: z.string().optional(),
  commitmentsTotalMin: z.string().optional(),
  commitmentsTotalMax: z.string().optional(),
  isMapped: z.boolean().optional(),
});

export type FindCsvUrlQueryParams = z.infer<typeof findCsvUrlQueryParams>;

@UseFilters(
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
)
@Controller("capital-projects")
export class CapitalProjectController {
  constructor(private readonly capitalProjectService: CapitalProjectService) {}

  @Get("/")
  async findMany(
    @Query(new ZodTransformPipe(findCapitalProjectsQueryParamsSchema))
    queryParams: FindCapitalProjectsQueryParams,
  ) {
    return await this.capitalProjectService.findMany({
      limit: queryParams.limit,
      offset: queryParams.offset,
      cityCouncilDistrictId: queryParams.cityCouncilDistrictId,
      communityDistrictCombinedId: queryParams.communityDistrictId,
      managingAgency: queryParams.managingAgency,
      agencyBudget: queryParams.agencyBudget,
      isMapped: queryParams.isMapped,
      commitmentsTotalMin: queryParams.commitmentsTotalMin,
      commitmentsTotalMax: queryParams.commitmentsTotalMax,
    });
  }

  @Get("/csv")
  async findCsvUrl(
    @Query(new ZodTransformPipe(findCsvUrlQueryParams))
    params: FindCsvUrlQueryParams,
  ) {
    const start = performance.now();
    const url = await this.capitalProjectService.findCsvUrl(params);
    console.debug("find url", performance.now() - start);
    return url;
  }

  @Put("/csv")
  async replaceCsv(
    @Query(new ZodTransformPipe(findCsvUrlQueryParams))
    params: FindCsvUrlQueryParams,
  ) {
    const start = performance.now();
    const url = await this.capitalProjectService.replaceCsv(params);
    console.debug("find url", performance.now() - start);
    return url;
  }

  @Get("/download")
  async findManyDownload(
    @Res() res: Response,
    @Query(new ZodTransformPipe(findCapitalProjectsQueryParamsSchema))
    queryParams: FindCapitalProjectsQueryParams,
  ) {
    const data = await this.capitalProjectService.findManyDownload({
      cityCouncilDistrictId: queryParams.cityCouncilDistrictId,
      communityDistrictCombinedId: queryParams.communityDistrictId,
      managingAgency: queryParams.managingAgency,
      agencyBudget: queryParams.agencyBudget,
      isMapped: queryParams.isMapped,
      commitmentsTotalMin: queryParams.commitmentsTotalMin,
      commitmentsTotalMax: queryParams.commitmentsTotalMax,
    });

    const csvFileSummary =
      `NYC Capital Projects Search:\n` +
      `${queryParams.cityCouncilDistrictId ? "City Council District:," + queryParams.cityCouncilDistrictId + "\n" : ""}` +
      `${queryParams.communityDistrictId ? "Community District:," + queryParams.communityDistrictId + "\n" : ""}` +
      `${queryParams.managingAgency ? "Managing Agency:," + queryParams.managingAgency + "\n" : ""}` +
      `${queryParams.agencyBudget ? "Agency Budget:," + queryParams.agencyBudget + "\n" : ""}` +
      `${queryParams.isMapped ? "Mapped Projects:," + queryParams.isMapped + "\n" : ""}` +
      `${queryParams.commitmentsTotalMin ? "Project Amount Minimum:," + queryParams.commitmentsTotalMin + "\n" : ""}` +
      `${queryParams.commitmentsTotalMax ? "Project Amount Maximum:," + queryParams.commitmentsTotalMax + "\n" : ""}`;

    const start = performance.now();
    const csvData = `${csvFileSummary}\n\n${unparse(data)}`;
    const end = performance.now();
    console.debug("time", end - start);

    res.set("Content-Type", "application/csv");
    res.set(
      "Content-Disposition",
      "attachment; filename=NYC_Capital_Planning_Map_Data_Export.csv",
    );
    res.send(csvData);
  }

  @UsePipes(
    new ZodTransformPipe(
      findCapitalProjectByManagingCodeCapitalProjectIdPathParamsSchema,
    ),
  )
  @Get("/:managingCode/:capitalProjectId")
  async findByManagingCodeCapitalProjectId(
    @Param() params: FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
  ) {
    return await this.capitalProjectService.findByManagingCodeCapitalProjectId(
      params,
    );
  }

  @UsePipes(
    new ZodTransformPipe(
      findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParamsSchema,
    ),
  )
  @Get("/:managingCode/:capitalProjectId/geojson")
  async findGeoJsonByManagingCodeCapitalProjectId(
    @Param()
    params: FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParams,
  ) {
    return await this.capitalProjectService.findGeoJsonByManagingCodeCapitalProjectId(
      params,
    );
  }

  @UsePipes(new ZodTransformPipe(findCapitalProjectTilesPathParamsSchema))
  @Get("/:z/:x/:y.pbf")
  async findTiles(
    @Param() params: FindCapitalProjectTilesPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.capitalProjectService.findTiles(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

  @UsePipes(
    new ZodTransformPipe(
      findCapitalCommitmentsByManagingCodeCapitalProjectIdPathParamsSchema,
    ),
  )
  @Get("/:managingCode/:capitalProjectId/capital-commitments")
  async findCapitalCommitmentsByManagingCodeCapitalProjectId(
    @Param()
    params: FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams,
  ) {
    return await this.capitalProjectService.findCapitalCommitmentsByManagingCodeCapitalProjectId(
      params,
    );
  }
}
