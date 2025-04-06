// import { ItemTemplateDTO } from '@/dto/ItemTemplateDTO';
// import { AttributeDTO } from '@/dto/AttributeDTO';
// import { ItemTemplateModel } from '@/models/ItemTemplateModel';
// import { 
//     itemTemplateSelectByIdQuery,
//     insertItemTemplate
// } from '@/queries/ItemTemplateQuery';
// import {
//     fetchFirst, 
//     executeQuery, 
//     executeTransaction,
//     getLastInsertId
// } from '@/utils/QueryHelper';
// import { ItemTemplateMapper } from '@/utils/mapper/ItemTemplateMapper';
// // Add these missing imports
// import { getAttributesByTemplateId, insertAttributeAndReturnID } from '@/services/AttributeService';

// /**
//  * Retrieves a single item template by its ID.
//  * 
//  * @param {number} id - The ID of the item template to retrieve.
//  * @returns {Promise<ItemTemplateDTO | null>} A promise that resolves to an ItemTemplateDTO object or null if not found.
//  */
// const getItemTemplateById = async (id: number): Promise<ItemTemplateDTO | null> => {
//     const result = await fetchFirst<ItemTemplateModel>(itemTemplateSelectByIdQuery, [id]);
//     return result ? ItemTemplateMapper.toDTO(result) : null;
// };

// /**
//  * Retrieves a single item template with its attributes by ID.
//  * 
//  * @param {number} id - The ID of the item template to retrieve.
//  * @returns {Promise<ItemTemplateDTO | null>} A promise that resolves to an ItemTemplateDTO object with attributes or null if not found.
//  */
// const getItemTemplateWithAttributesById = async (id: number): Promise<ItemTemplateDTO | null> => {
//     const template = await getItemTemplateById(id);
    
//     if (!template) {
//         return null;
//     }
    
//     // Get the attributes for this template
//     const attributes = await getAttributesByTemplateId(id);
    
//     // Add the attributes to the template
//     return {
//         ...template,
//         attributes
//     };
// };

// /**
//  * Inserts a new item template into the database and returns its ID.
//  * 
//  * @param {ItemTemplateDTO} itemTemplateDTO - The DTO representing the item template to insert.
//  * @returns {Promise<number | null>} A promise that resolves to the inserted item template's ID, or null if the insertion fails.
//  */
// const insertItemTemplateAndReturnID = async (itemTemplateDTO: ItemTemplateDTO): Promise<number | null> => {
//     try {

//         await executeQuery(insertItemTemplate, [
//             itemTemplateDTO.title,
//             itemTemplateDTO.categories
//         ]);

//         // get inserted item template ID
//         const result = await getLastInsertId();

//         if (result) {
//             console.log("Inserted Item Template ID:", result);
//             return result;
//         } else {
//             console.error("Failed to fetch inserted item template ID");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error inserting item template:", error);
//         return null;
//     }
// };

// /**
//  * Creates a new item template with attributes.
//  * 
//  * @param {ItemTemplateDTO} templateDTO - The template to create.
//  * @param {AttributeDTO[]} attributes - The attributes to associate with the template.
//  * @returns {Promise<number | null>} A promise that resolves to the created template's ID, or null if creation fails.
//  */
// const createItemTemplateWithAttributes = async (
//     templateDTO: ItemTemplateDTO, 
//     attributes: AttributeDTO[]
// ): Promise<number | null> => {
//     try {
//         return await executeTransaction(async () => {
//             // Insert the template
//             const templateId = await insertItemTemplateAndReturnID(templateDTO);
//             if (!templateId) {
//                 throw new Error("Failed to insert item template");
//             }
            
//             // Insert each attribute
//             for (const attribute of attributes) {
//                 const attributeWithTemplateId: AttributeDTO = {
//                     ...attribute,
//                     itemTemplateID: templateId
//                 };
                
//                 const attributeId = await insertAttributeAndReturnID(attributeWithTemplateId);
//                 if (!attributeId) {
//                     throw new Error("Failed to insert attribute");
//                 }
//             }
            
//             return templateId;
//         });
//     } catch (error) {
//         console.error("Error creating item template with attributes:", error);
//         return null;
//     }
// };

// export {
//     getItemTemplateById,
//     getItemTemplateWithAttributesById,
//     insertItemTemplateAndReturnID,
//     createItemTemplateWithAttributes,
// }