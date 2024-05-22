export const capitalProjectCategory = {
  "Fixed Asset": "Fixed Asset",
  "Lump Sum": "Lump Sum",
  "ITT, Vehicles and Equipment": "ITT, Vehicles and Equipment",
} as const;
export type CapitalProjectCategory =
  (typeof capitalProjectCategory)[keyof typeof capitalProjectCategory];
