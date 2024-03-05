import { z } from "zod";

/*
 * PostGIS encodes spatial information in their own "geometry" type
 * It has a similar shape to a string when passed to Javascript
 */
export type Geom = string;

export const geomSchema = z.string().describe("PostGIS geometry type");
