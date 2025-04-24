import { AttributeDTO } from './AttributeDTO';

/**
 * Represents an ItemTemplate data structure
 */
export type ItemTemplateDTO = {
  item_templateID?: number;
  template_name: string;
  attributes?: AttributeDTO[]; // Array of associated attributes
};
