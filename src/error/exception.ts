import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { INVALID_REQUEST_PARAMETER } from ".";
import { DATA_RETRIEVAL_ERROR } from "./message";

export const InvalidRequestParameterException = new BadRequestException(
  INVALID_REQUEST_PARAMETER,
);

export const RequestedResourceNotFound = new NotFoundException();

export const DataRetrievalException = new InternalServerErrorException(
  DATA_RETRIEVAL_ERROR,
);
