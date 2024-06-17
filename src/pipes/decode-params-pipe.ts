import { PipeTransform } from "@nestjs/common";
import { InvalidRequestParameterException } from "src/exception";
import { ZodObject, ZodOptional, ZodRawShape } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

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

/**
 * Parameters sent in a url, such as path and query parameters, are encoded as strings.
 * Also, arrays primarily follow a "form, non-exploded" format. For example [0,1,2] is sent in the
 * url as "0,1,2". (Though in some cases, client tools will serialize the array in "form, exploded" format,
 * with brackets appended to the parameter name. For example, param[]=0,param[]=1.)
 * The DecodeParamsPipe converts the parameters from their string encoding to their open-api documented type.
 * It supports both "form, non-exploded" and "form, exploded" serialization formats.
 *
 * The zodToJsonSchema creates an easy-to-parse json object that describes the documented type.
 * When the type should be a number, it is coerced to a number or NaN. When the type should be array,
 * it is split on the commas into an array. When the array should have numeric items,
 * the items are parsed into numbers or NaN.
 *
 * The decoded params can then be sent to the Zod Validation Pipe to confirm the parameter content conforms
 * to the documentation.
 */
export class DecodeParamsPipe<T extends ZodRawShape> implements PipeTransform {
  constructor(private schema: ZodObject<T> | ZodOptional<ZodObject<T>>) {}

  transform(params: Record<string, string | string[]>) {
    const schemaProperties = (
      zodToJsonSchema(this.schema) as {
        properties: Record<string, JsonSchema | undefined>;
      }
    ).properties;

    return Object.entries(params).reduce(
      (
        config: Record<string, string | number | Array<string> | Array<number>>,
        [param, value],
      ) => {
        const properties = schemaProperties[param];
        if (properties?.type === "number") {
          // Guard against the parameter being formatted in such a way that it was deserialized upstream into an array
          if (Array.isArray(value))
            throw new InvalidRequestParameterException();
          config[param] = parseFloat(value);
        } else if (properties?.type === "array") {
          // with formats like arrayBracket, the array was already created upstream;
          // array creation can be skipped
          const values = Array.isArray(value) ? value : value.split(",");
          config[param] =
            properties.items.type === "number"
              ? values.map((value) => parseFloat(value))
              : values;
        } else {
          config[param] = value;
        }

        return config;
      },
      {},
    );
  }
}
