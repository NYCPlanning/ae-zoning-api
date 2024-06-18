import { z } from "zod";
import { ZodTransformPipe } from "./zod-transform-pipe";
import { InvalidRequestParameterException } from "src/exception";

describe("zod transform pipe", () => {
  const testSchema = z.object({
    numeric: z.coerce.number().max(100),
    textual: z.coerce.string(),
    numericArray: z.array(z.coerce.number()),
    textualArray: z.array(z.coerce.string()),
  });

  const strictSchema = z.object({
    numeric: z.number().max(100),
    textual: z.string(),
    numericArray: z.array(z.number()),
    textualArray: z.array(z.string()),
  });

  it("should parse properly formatted parameters defined in the schema", () => {
    const params = {
      numeric: "42",
      textual: "text",
      numericArray: "1",
      textualArray: "foo",
    };
    expect(() => strictSchema.parse(params)).toThrow();

    const transformedParams = new ZodTransformPipe(testSchema).transform(
      params,
    );

    expect(() => strictSchema.parse(transformedParams)).not.toThrow();
  });

  it("should handle arrays that were already created upstream", () => {
    const params = {
      numeric: "42",
      textual: "text",
      numericArray: ["1", "2"],
      textualArray: ["foo", "bar"],
    };
    expect(() => strictSchema.parse(params)).toThrow();

    const transformedParams = new ZodTransformPipe(testSchema).transform(
      params,
    );

    expect(() => strictSchema.parse(transformedParams)).not.toThrow();
  });

  it("should error when the numeric value cannot be coerced", () => {
    const params = {
      numeric: "this is text",
      textual: "text",
      numericArray: "1",
      textualArray: "foo",
    };

    expect(() => strictSchema.parse(params)).toThrow();

    expect(() => new ZodTransformPipe(testSchema).transform(params)).toThrow(
      InvalidRequestParameterException,
    );
  });

  it("should error when the numeric is above the max", () => {
    const params = {
      numeric: "101",
      textual: "text",
      numericArray: "1",
      textualArray: "foo",
    };

    expect(() => strictSchema.parse(params)).toThrow();

    expect(() => new ZodTransformPipe(testSchema).transform(params)).toThrow(
      InvalidRequestParameterException,
    );
  });
});
