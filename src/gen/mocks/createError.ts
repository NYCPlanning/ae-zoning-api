import { faker } from "@faker-js/faker";

import { Error } from "../types/Error";

export function createError(): NonNullable<Error> {
  return {
    statusCode: faker.number.float({}),
    message: faker.string.alpha(),
    error: faker.string.alpha(),
  };
}
