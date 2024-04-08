import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { DataRetrievalException } from "src/exception";
import { HttpName } from ".";

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
      name: exception.name,
      db_name: process.env.DATABASE_NAME,
    };

    const ctx = host.switchToHttp();

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
