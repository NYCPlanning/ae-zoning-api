export const zoningDistrictClassCategory = {
  Residential: "Residential",
  Commercial: "Commercial",
  Manufacturing: "Manufacturing",
} as const;
export type ZoningDistrictClassCategory =
  (typeof zoningDistrictClassCategory)[keyof typeof zoningDistrictClassCategory];
