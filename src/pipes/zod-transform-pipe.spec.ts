import { z } from "zod";
import { ZodTransformPipe } from "./zod-transform-pipe";
import { InvalidRequestParameterException } from "src/exception";

describe("zod transform pipe", () => {
  const paramsSchema = z.object({
    numeric: z.number().max(100),
    integer: z.number().int().max(100),
    textual: z.string(),
    numericArray: z.array(z.number()),
    textualArray: z.array(z.string()),
    boolean: z.boolean(),
  });

  it("should parse properly formatted parameters defined in the schema", () => {
    const params = {
      numeric: "42.5",
      integer: "42",
      textual: "text",
      numericArray: "1",
      textualArray: "foo",
      boolean: "true",
    };
    expect(() => paramsSchema.parse(params)).toThrow();

    const transformedParams = new ZodTransformPipe(paramsSchema).transform(
      params,
    );

    expect(() => paramsSchema.parse(transformedParams)).not.toThrow();
  });

  it("should handle arrays that were already created upstream", () => {
    const params = {
      numeric: "42.5",
      integer: "42",
      textual: "text",
      numericArray: ["1", "2"],
      textualArray: ["foo", "bar"],
      boolean: "true",
    };
    expect(() => paramsSchema.parse(params)).toThrow();

    const transformedParams = new ZodTransformPipe(paramsSchema).transform(
      params,
    );

    expect(() => paramsSchema.parse(transformedParams)).not.toThrow();
  });

  it("should error when the numeric array cannot be coerced", () => {
    const params = {
      numeric: "42",
      integer: "42",
      textual: "text",
      numericArray: "this is text in the array",
      textualArray: "foo",
      boolean: "true",
    };

    expect(() => paramsSchema.parse(params)).toThrow();

    expect(() => new ZodTransformPipe(paramsSchema).transform(params)).toThrow(
      InvalidRequestParameterException,
    );
  });

  it("should error when the numeric is above the max", () => {
    const params = {
      numeric: "101",
      integer: "42",
      textual: "text",
      numericArray: "1",
      textualArray: "foo",
      boolean: "true",
    };

    expect(() => paramsSchema.parse(params)).toThrow();

    expect(() => new ZodTransformPipe(paramsSchema).transform(params)).toThrow(
      InvalidRequestParameterException,
    );
  });

  it("should error when the boolean is not a valid", () => {
    const params = {
      numeric: "42",
      integer: "42",
      textual: "text",
      numericArray: "1",
      textualArray: "foo",
      boolean: "f",
    };

    expect(() => paramsSchema.parse(params)).toThrow();

    expect(() => new ZodTransformPipe(paramsSchema).transform(params)).toThrow(
      InvalidRequestParameterException,
    );
  });
});
