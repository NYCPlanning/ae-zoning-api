import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { DATA_RETRIEVAL_ERROR, INVALID_REQUEST_PARAMETER } from "./message";

export const DataRetrievalException = new InternalServerErrorException(
  DATA_RETRIEVAL_ERROR,
);

export const InvalidRequestParameterException = new BadRequestException(
  INVALID_REQUEST_PARAMETER,
);

export const ResourceNotFoundException = new NotFoundException();
