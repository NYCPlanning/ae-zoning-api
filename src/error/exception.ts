import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { DATA_RETRIEVAL_ERROR, INVALID_REQUEST_PARAMETER } from "./message";

export class DataRetrievalException extends Error {
  constructor(message = DATA_RETRIEVAL_ERROR) {
    super(message);
    this.name = "DataRetrievalException";
  }
}

export const DataRetrievalHttpException = new InternalServerErrorException(
  DATA_RETRIEVAL_ERROR,
);

export const InvalidRequestParameterException = new BadRequestException(
  INVALID_REQUEST_PARAMETER,
);

export const ResourceNotFoundException = new NotFoundException();
