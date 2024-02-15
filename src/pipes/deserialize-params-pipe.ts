// @ts-nocheck
import { PipeTransform } from "@nestjs/common";
import * as qs from "qs";
import { FindTaxLotsQueryParamsDto } from "src/tax-lot/tax-lot.controller.dto";
import { ZodObject } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export class DeserializeParamsPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}
  transform(params: any) {
    const parsed =  qs.parse(params, { comma: true })
    console.debug("parsed", Object.entries(parsed));
    const jsonSchema = zodToJsonSchema(this.schema)
    const schemaProperties = jsonSchema.properties;
    // const coerced = parsed.entries.map((key, value) => {
    //   // const definition = schemaProperties[key]
    //   console.debug("key", key);
    //   console.debug('value', value);
    // })
    return parsed;
  }
}

