import { z } from "zod";

// STRINGS
// constraints
export const string30 = z
  .string()
  .min(1, { message: "A minimum of 1 character is needed." })
  .max(30, { message: "A maximum of 30 characters is permitted." });
export type String30 = z.infer<typeof string30>;

export const string750 = z
  .string()
  .min(1, { message: "A minimum of 1 character is needed." })
  .max(750, { message: "A maximum of 750 characters is permitted." });
export type String750 = z.infer<typeof string750>;

export const string20000 = z.string().max(20000).nullable();
export type String20000 = z.infer<typeof string20000>;

// optional
export const optionalString = z.string().optional();
export type OptionalString = z.infer<typeof optionalString>;
export const optionalNullableString = z.string().optional().nullable();
export type OptionalNullableString = z.infer<typeof optionalNullableString>;

// hex col
export const hexColor = z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
  message: "Invalid hex color code",
});
export type HexColor = z.infer<typeof hexColor>;

// optional
export const optionalHexColor = hexColor.optional();
export type OptionalHexColor = z.infer<typeof optionalHexColor>;

// ---------------------------------------------------------------------------
// DATES
export const date = z.date();
export type DateType = z.infer<typeof date>;

// ---------------------------------------------------------------------------
// NUMBERS
// natural numbers
export const positiveInt = z.number().int().positive();
export type PositiveInt = z.infer<typeof positiveInt>;

// optional
export const optionalPositiveInt = positiveInt.nullable().optional();
export type OptionalPositiveInt = z.infer<typeof optionalPositiveInt>;

// BOOLEANS
export const boolean = z.boolean();
export type BooleanType = z.infer<typeof boolean>;
