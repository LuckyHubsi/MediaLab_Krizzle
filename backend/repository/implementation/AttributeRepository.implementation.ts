import { Attribute, NewAttribute } from "@/backend/domain/common/Attribute";
import * as SQLite from "expo-sqlite";
import { AttributeRepository } from "../interfaces/AttributeRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import {
  insertAttributeQuery,
  insertMultiselectOptionsQuery,
  insertRatingSymbolQuery,
  selectPreviewAttributesQuery,
} from "../query/AttributeQuery";
import { AttributeMapper } from "@/backend/util/mapper/AttributeMapper";
import {
  RepositoryError,
  RepositoryErrorNew,
} from "@/backend/util/error/RepositoryError";
import {
  attributeID,
  AttributeID,
  ItemTemplateID,
  PageID,
} from "@/backend/domain/common/IDs";

/**
 * Implementation of the AttributeRepository interface using SQL queries.
 *
 * Handles the following operations:
 * - Inserting a new attribute / multiselect options / rating symbol.
 */
export class AttributeRepositoryImpl
  extends BaseRepositoryImpl
  implements AttributeRepository
{
  // constructor accepts database instace
  constructor(db: SQLite.SQLiteDatabase) {
    super(db);
  }

  /**
   * Inserts a new attribute into the database.
   *
   * @param newAttribute - A `NewAttribute` object containing the attribute data.
   * @param templateID - A `TemplateID` object representing the template ID.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to an `AttributeID` if insertion succeeded.
   * @throws RepositoryErrorNew if the insertion fails.
   */
  async insertAttribute(
    newAttribute: NewAttribute,
    templateID: ItemTemplateID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<AttributeID> {
    try {
      const attributeId = await this.executeTransaction(async (transaction) => {
        await this.executeQuery(
          insertAttributeQuery,
          [
            newAttribute.attributeLabel,
            newAttribute.type,
            newAttribute.preview ? 1 : 0,
            templateID,
          ],
          txn ?? transaction,
        );

        const lastInsertedID = await this.getLastInsertId(txn);
        return lastInsertedID;
      });
      return attributeID.parse(attributeId);
    } catch (error) {
      throw new RepositoryErrorNew("Insert Failed");
    }
  }

  /**
   * Inserts attribute multiselect options into the database.
   *
   * @param optios - An array of strings representing all options.
   * @param attributeID - An `AttributeID` object representing the attribute ID.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryErrorNew if the insertion fails.
   */
  async insertMultiselectOptions(
    options: string[],
    attributeID: AttributeID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await this.executeQuery(
        insertMultiselectOptionsQuery,
        [JSON.stringify(options), attributeID],
        txn,
      );
    } catch (error) {
      throw new RepositoryErrorNew("Insert Failed");
    }
  }

  /**
   * Inserts attribute rating symbol into the database.
   *
   * @param symbol - A string representing the rating symbol.
   * @param attributeID - An `AttributeID` object representing the attribute ID.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to void.
   * @throws RepositoryErrorNew if the insertion fails.
   */
  async insertRatingSymbol(
    symbol: string,
    attributeID: AttributeID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await this.executeQuery(
        insertRatingSymbolQuery,
        [symbol, attributeID],
        txn,
      );
    } catch (error) {
      throw new RepositoryErrorNew("Insert Failed");
    }
  }

  /**
   * Retrieves the preview attributes based on a page ID.
   *
   * @param pageId - An `PageID` object representing the page ID the attribute belongs to.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to an array of `Attribute` entities.
   * @throws RepositoryError if the fetch fails.
   */
  async getPreviewAttributes(
    pageId: PageID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<Attribute[]> {
    try {
      const attributes = await this.fetchAll<any>(
        selectPreviewAttributesQuery,
        [pageId],
        txn,
      );

      return attributes.map(AttributeMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch preview attributes.");
    }
  }
}
