import { Inject, Injectable } from "@nestjs/common";
import {
  DataRetrievalException,
  ResourceNotFoundException,
} from "src/exception";
import { ConfigType } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { ZoningDistrictRepository } from "./zoning-district.repository";
import { StorageConfig } from "src/config";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";

@Injectable()
export class ZoningDistrictService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
    @Inject(ZoningDistrictRepository)
    private readonly zoningDistrictRepository: ZoningDistrictRepository,
  ) {}

  async findZoningDistrictByUuid(uuid: string) {
    const zoningDistrict = await this.zoningDistrictRepository.findByUuid(uuid);
    if (zoningDistrict === undefined) throw new ResourceNotFoundException();

    return zoningDistrict;
  }

  async findClassesByZoningDistrictUuid(id: string) {
    const zoningDistrictCheck =
      await this.zoningDistrictRepository.checkZoningDistrictById(id);
    if (zoningDistrictCheck === undefined)
      throw new ResourceNotFoundException();
    const zoningDistrictClasses =
      await this.zoningDistrictRepository.findClassesByUuid(id);

    return {
      zoningDistrictClasses,
    };
  }

  async findTilesets(z: number, x: number, y: number) {
    console.debug(`hitting tilesets at: z: ${z}, ${x}, ${y}`);
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          `${this.storageConfig.storageUrl}/tilesets/zoning_district/${z}/${x}/${y}.pbf`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error("error while retrieving data", error?.response?.data);
            throw new DataRetrievalException();
          }),
        ),
    );
    // console.debug("data", data);
    // console.debug('data type', typeof data);
    return data;
  }
}
