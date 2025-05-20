import { AttributeDTO } from "./AttributeDTO";

/**
 * Data Transfer Object for template.
 * Used for transferring template data between the backend and frontend.
 */
export type ItemTemplateDTO = {
  item_templateID?: number; // optional unique identifier for the template (e.g., undefined when creating a new template)
  template_name: string; // the name of the template
  attributes: AttributeDTO[]; // array of attribute DTOs
};
