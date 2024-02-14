import { PipeTransform } from "@nestjs/common";
import {
  decodeDelimitedArray,
  decodeQueryParams,
  encodeDelimitedArray,
} from "serialize-query-params";

export const CommaArrayParam = {
  encode: (array: string[] | null | undefined) =>
    encodeDelimitedArray(array, ","),

  decode: (arrayStr: string | string[] | null | undefined) =>
    decodeDelimitedArray(arrayStr, ","),
};

export class DeserializeParamsPipe implements PipeTransform {
  constructor(private schema: any) {}
  transform(params: any) {
    console.debug("deserialize", params);
    const decoded = decodeQueryParams(this.schema, params);
    console.log(decoded);
    return decoded;
  }
}
