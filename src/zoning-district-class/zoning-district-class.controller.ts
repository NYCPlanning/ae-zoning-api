import { Controller, Get, Param } from "@nestjs/common";
import { ZoningDistrictClassService } from "./zoning-district-class.service";

@Controller("zoning-district-classes")
export class ZoningDistrictClassController {
  constructor(private readonly zoningDistrictClassService: ZoningDistrictClassService) {}

}
