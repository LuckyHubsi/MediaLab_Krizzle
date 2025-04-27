import { AttributeDTO, isValidAttributeType } from "@/dto/AttributeDTO";
import { AttributeType } from "@/utils/enums/AttributeType";
import {
  insertAttributeQuery,
  insertMultiselectOptionsQuery,
} from "@/queries/AttributeQuery";
import { executeQuery, getLastInsertId } from "@/utils/QueryHelper";
import { DatabaseError } from "@/utils/DatabaseError";
import * as SQLite from "expo-sqlite";

/**
 * Inserts a new attribute into the database and returns its ID.
 *
 * @param {AttributeDTO} attributeDTO - The DTO representing the attribute to insert.
 * @returns {Promise<void>} A promise that resolves to void.
 *
 *  @throws {DatabaseError} If the insert fails.
 */
const insertAttribute = async (
  attributeDTO: AttributeDTO,
  txn?: SQLite.SQLiteDatabase,
): Promise<void> => {
  try {
    // Validate attribute type or use default
    if (!isValidAttributeType(attributeDTO.type)) {
      attributeDTO.type = AttributeType.Text;
    }

    await executeQuery(
      insertAttributeQuery,
      [
        attributeDTO.attributeLabel,
        attributeDTO.type,
        attributeDTO.preview ? 1 : 0,
        attributeDTO.itemTemplateID,
      ],
      txn,
    );
  } catch (error) {
    throw new DatabaseError("Failed to insert template attribute");
  }
};

/**
 * Inserts a new multiselect attribute option into the database.
 *
 * @param {string} option - The label of the option.
 * @param {number} attributeID - The id of the attribute the option belongs to.
 *
 * @returns {Promise<void>} A promise that resolves to void.
 * @throws {DatabaseError} If the insert fails.
 */
const insertMultiselectOptions = async (
  option: string,
  attributeID: number,
  txn?: SQLite.SQLiteDatabase,
): Promise<void> => {
  try {
    await executeQuery(
      insertMultiselectOptionsQuery,
      [option, attributeID],
      txn,
    );
  } catch (error) {
    throw new DatabaseError("Failed to insert attribute");
  }
};

export { insertAttribute, insertMultiselectOptions };
