import { PipeTransform } from "@nestjs/common";
import * as qs from "qs";
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

export class DeserializeParamsPipe<T extends ZodRawShape>
  implements PipeTransform
{
  constructor(private schema: ZodObject<T>) {}
  transform(params: string) {
    // parse complex data structures, like arrays
    const parsed = qs.parse(params, { comma: true });

    // get the expected definitions for the data structure
    const schemaProperties = (
      zodToJsonSchema(this.schema) as {
        properties: Record<string, JsonSchema | undefined>;
      }
    ).properties;

    // coerce numbers and arrays of numbers
    const coerced = Object.entries(parsed).map(([key, value]) => {
      const definition = schemaProperties[key];

      switch (definition?.type) {
        case "number": {
          return [key, Number.parseFloat(value as string)];
        }
        case "array": {
          return definition.items.type === "number"
            ? [
                key,
                (value as Array<string>).map((item) => Number.parseFloat(item)),
              ]
            : [key, value];
        }
        default:
          return [key, value];
      }
    });

    return Object.fromEntries(coerced);
  }
}
