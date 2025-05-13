import { AttributeDTO, AttributeDTORestructure } from "./AttributeDTO";

/**
 * Represents an ItemTemplate data structure
 */
export type ItemTemplateDTO = {
  item_templateID?: number;
  template_name: string;
  attributes?: AttributeDTO[]; // Array of associated attributes
};

/**
 * Data Transfer Object for template.
 * Used for transferring template data between the backend and frontend.
 */
export type ItemTemplateDTORestructure = {
  item_templateID?: number; // optional unique identifier for the template (e.g., undefined when creating a new template)
  template_name: string; // the name of the template
  attributes: AttributeDTORestructure[]; // array of attribute DTOs
};
