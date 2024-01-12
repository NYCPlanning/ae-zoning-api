import { z } from "zod";

// export const pointSchema = z.tuple([z.number(), z.number()])
export const pointSchema = z.array(z.number()).length(2);
// export const pointSchema = z.number();

export const positionSchema = z.array(pointSchema);

export const multiPolygonSchema = z.array(z.array(z.array(positionSchema)));
