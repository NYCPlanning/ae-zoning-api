import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import {
  DataRetrievalException,
  InvalidRequestParameterException,
  ResourceNotFoundException,
} from "./exception";
import { HttpName } from "./http-name";

@Catch(DataRetrievalException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = {
      statusCode: httpStatus,
      message: exception.message,
      error: HttpName.INTERNAL_SEVER_ERROR,
    };

    const ctx = host.switchToHttp();

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

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
