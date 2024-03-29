import { ValueProvider } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { RavenInterceptor } from "nest-raven";

export const RavenProvider: ValueProvider = {
  provide: APP_INTERCEPTOR,
  useValue: new RavenInterceptor(),
};
