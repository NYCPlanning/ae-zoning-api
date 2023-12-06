import { z } from "zod";

export const positionSchema = z.array(z.number());
