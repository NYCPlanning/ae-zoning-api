import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { InvalidRequestParameterException } from "src/exception";
import { HttpName } from ".";

@Catch(InvalidRequestParameterException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const httpStatus = HttpStatus.BAD_REQUEST;
    const responseBody = {
      statusCode: httpStatus,
      message: exception.message,
      error: HttpName.BAD_REQUEST,
    };

    const ctx = host.switchToHttp();

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
