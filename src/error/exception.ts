import { BadRequestException, NotFoundException } from "@nestjs/common";
import { INVALID_REQUEST_PARAMETER } from ".";

export const InvalidRequestParameterException = new BadRequestException(
  INVALID_REQUEST_PARAMETER,
);

export const RequestedResourceNotFound = new NotFoundException();
