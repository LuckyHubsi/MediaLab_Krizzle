import { AttributeDTO } from "./AttributeDTO";

/**
 * Represents an ItemAttributeValue data structure
 */
export type ItemAttributeValueDTO =
  | (AttributeDTO & { valueID?: number; itemID: number; valueString: string })
  | (AttributeDTO & { valueID?: number; itemID: number; valueNumber: number });
