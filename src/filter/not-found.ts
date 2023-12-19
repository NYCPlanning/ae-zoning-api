import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { HttpName } from ".";
import { ResourceNotFoundException } from "src/exception";

@Catch(ResourceNotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const httpStatus = HttpStatus.NOT_FOUND;
    const responseBody = {
      statusCode: httpStatus,
      message: HttpName.NOT_FOUND,
    };

    const ctx = host.switchToHttp();

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
