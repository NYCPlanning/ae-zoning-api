import { z } from "zod";
import { DecodeParamsPipe } from "./decode-params-pipe";

describe("decode params pipe", () => {
  const genericSchema = z.object({
    numeric: z.number(),
    textual: z.string(),
    numericArray: z.number().array(),
    textualArray: z.string().array(),
  });

  it("should parse properly formatted parameters defined in the schema", () => {
    const params = {
      numeric: "42",
      textual: "text",
      numericArray: "1",
      textualArray: "foo",
    };
    expect(() => genericSchema.parse(params)).toThrow();

    const decodedParams = new DecodeParamsPipe(genericSchema).transform(params);

    expect(() => genericSchema.parse(decodedParams)).not.toThrow();
  });

  it("should let parameters not defined in the schema pass through as strings", () => {
    const params = {
      numeric: "42",
      textual: "text",
      numericArray: "1",
      textualArray: "foo",
      extraValue: "37",
    };

    expect(() => genericSchema.parse(params)).toThrow();

    const decodedParams = new DecodeParamsPipe(genericSchema).transform(params);

    expect(() => genericSchema.parse(decodedParams)).not.toThrow();
    expect(typeof decodedParams.extraValue).toBe("string");
  });

  it("should coerce strings to NaN when the parameter is numeric", () => {
    const params = {
      numeric: "this is text",
      textual: "text",
      numericArray: "1",
      textualArray: "foo",
    };

    expect(() => genericSchema.parse(params)).toThrow();

    const decodedParams = new DecodeParamsPipe(genericSchema).transform(params);

    expect(() => genericSchema.parse(decodedParams)).toThrow();
    expect(decodedParams.numeric).toBeNaN();
  });
});
