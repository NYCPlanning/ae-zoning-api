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

@Catch(
  DataRetrievalException,
  InvalidRequestParameterException,
  ResourceNotFoundException,
)
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const { message } = exception;
    console.info("message", message);
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const httpName = HttpName.INTERNAL_SEVER_ERROR;
    let responseBody: {
      statusCode: number;
      message: HttpName | string;
      error?: string;
    };
    switch (true) {
      case exception instanceof DataRetrievalException:
      case exception instanceof InvalidRequestParameterException: {
        statusCode = HttpStatus.BAD_REQUEST;
        if (message) {
          responseBody = {
            statusCode,
            message,
            error: HttpName.BAD_REQUEST,
          };
        } else {
          responseBody = {
            statusCode,
            message: HttpName.BAD_REQUEST,
          };
        }
        break;
      }
      default: {
        responseBody = {
          statusCode,
          message: httpName,
        };
        break;
      }
    }

    const ctx = host.switchToHttp();

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}

@Catch()
export class DataRetrievalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: DataRetrievalException, host: ArgumentsHost) {
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

@Catch()
export class InvalidRequestParameterExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: InvalidRequestParameterException, host: ArgumentsHost) {
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

@Catch()
export class ResourceNotFoundExceptionFilter implements ExceptionFilter {
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
