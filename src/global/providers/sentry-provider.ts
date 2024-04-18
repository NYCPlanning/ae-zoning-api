import { HttpException } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { SentryInterceptor } from "@ntegral/nestjs-sentry";

export const SentryProvider = {
  provide: APP_INTERCEPTOR,
  useFactory: () =>
    new SentryInterceptor({
      filters: [
        {
          type: HttpException,
          filter: (exception: HttpException) => 500 > exception.getStatus(), // Only report 500 errors
        },
      ],
    }),
};
