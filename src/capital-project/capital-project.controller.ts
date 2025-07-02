import {
  Controller,
  Get,
  Param,
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
import { generateExcelDocument } from "src/downloads";

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

    const tableHeaders = [
      { variable: "id", label: "Capital Project ID" },
      { variable: "description", label: "Description" },
      { variable: "managingCode", label: "Managing Code" },
      { variable: "managingAgency", label: "Managing Agency" },
      { variable: "maxDate", label: "Max Date" },
      { variable: "minDate", label: "Min Date" },
      { variable: "category", label: "Category" },
    ];

    const xlsxData = await generateExcelDocument({
      templateFilename: "src/downloads/template.xlsx",
      outputFilename: "src/downloads/output.xlsx",
      reportName: "Capital Projects Map Report",
      sheets: [
        {
          tableName: "Capital Projects",
          tableHeaders,
          queryParams,
          data,
        },
      ],
    });

    res.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.set(
      "Content-Disposition",
      "attachment; filename=NYC_Capital_Planning_Map_Data_Export.xlsx",
    );
    res.send(xlsxData);
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
