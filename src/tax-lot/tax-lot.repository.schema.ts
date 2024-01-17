import { z } from "zod";
import { boroughEntitySchema, landUseEntitySchema } from "src/schema";

export const findByBblSchema = z.object({
  bbl: z.string().regex(RegExp("^([0-9]{10})$")),
  block: z.string().regex(RegExp("^([0-9]{1,5})$")),
  lot: z.string().regex(RegExp("^([0-9]{1,4})$")),
  address: z.string().nullable(),
  borough: boroughEntitySchema,
  landUse: landUseEntitySchema.nullable(),
});

export type FindByBbl = z.infer<typeof findByBblSchema>;

export const findByBblSpatialSchema = findByBblSchema.extend({
  geometry: z
    .string()
    .regex(
      /^{"coordinates":\[\[(\[\[-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?,-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?\](,\[-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?,-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?\]){3,}\])(,\[\[-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?,-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?\](,\[-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?,-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?\]){3,}\]){0,}\]\],"type":"MultiPolygon"}$/,
    ),
});

export type FindByBblSpatial = z.infer<typeof findByBblSpatialSchema>;
