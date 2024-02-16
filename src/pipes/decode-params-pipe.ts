import { PipeTransform } from "@nestjs/common";
import { ZodObject, ZodRawShape } from "zod";
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
 * Also, arrays follow a "simple, exploded" format. For example [0,1,2] is sent in the
 * url as "0,1,2". The DecodeParamsPipe converts the parameters from their string encoding
 * to their open-api documented type.
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
  constructor(private schema: ZodObject<T>) {}

  transform(params: Record<string, string>) {
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
          config[param] = parseFloat(value);
        } else if (properties?.type === "array") {
          const values = value.split(",");
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
