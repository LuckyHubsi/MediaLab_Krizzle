import { AttributeDTO } from "./AttributeDTO";

export type ItemAttributeValueDTO =
  | (AttributeDTO & { valueID?: number; itemID?: number; valueString?: string })
  | (AttributeDTO & { valueID?: number; itemID?: number; valueNumber?: number })
  | (AttributeDTO & {
      valueID?: number;
      itemID?: number;
      valueMultiselect?: { multiselectID: number; options: string }[];
    });
