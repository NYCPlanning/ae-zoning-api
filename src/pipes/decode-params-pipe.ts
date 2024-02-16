import { PipeTransform } from "@nestjs/common";
import { ZodObject, ZodRawShape } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  encodeDelimitedArray,
  decodeDelimitedArray,
  encodeDelimitedNumericArray,
  decodeDelimitedNumericArray,
  decodeQueryParams,
  StringParam,
  NumberParam,
} from "serialize-query-params";

type JsonSchema =
  | {
      type: "string" | "number";
    }
  | {
      type: "array";
      items: {
        type: "string" | "number";
      };
    };

const CommaArrayParam = {
  encode: (array: string[] | null | undefined) =>
    encodeDelimitedArray(array, ","),

  decode: (arrayStr: string | null | undefined) =>
    decodeDelimitedArray(arrayStr, ","),
};

const CommaNumericArrayParam = {
  encode: (array: number[] | null | undefined) =>
    encodeDelimitedNumericArray(array, ","),

  decode: (arrayStr: string | null | undefined) =>
    decodeDelimitedNumericArray(arrayStr, ","),
};

export class DecodeParamsPipe<T extends ZodRawShape> implements PipeTransform {
  constructor(private schema: ZodObject<T>) {}

  transform(params: Record<string, string>) {
    const schemaProperties = (
      zodToJsonSchema(this.schema) as {
        properties: Record<string, JsonSchema | undefined>;
      }
    ).properties;

    const paramsConfig = Object.keys(params).reduce(
      (
        config: Record<
          string,
          | typeof StringParam
          | typeof NumberParam
          | typeof CommaArrayParam
          | typeof CommaNumericArrayParam
        >,
        param,
      ) => {
        const schema = schemaProperties[param];

        switch (schema?.type) {
          case "string":
            config[param] = StringParam;
            break;
          case "number":
            config[param] = NumberParam;
            break;
          case "array":
            config[param] =
              schema.items.type === "number"
                ? CommaNumericArrayParam
                : CommaArrayParam;
            break;
          default:
            config[param] = StringParam;
            break;
        }
        return config;
      },
      {},
    );

    return decodeQueryParams(paramsConfig, params);
  }
}
