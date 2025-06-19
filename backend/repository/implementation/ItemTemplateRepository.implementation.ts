import {
  ItemTemplate,
  NewItemTemplate,
} from "@/backend/domain/entity/ItemTemplate";
import { ItemTemplateRepository } from "../interfaces/ItemTemplateRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import * as SQLite from "expo-sqlite";
import { ItemTemplateModel } from "../model/ItemTemplateModel";
import {
  insertItemTemplateQuery,
  selectItemTemplateByTemplateIDQuery,
} from "../query/ItemTemplateQuery";
import { ItemTemplateMapper } from "@/backend/util/mapper/ItemTemplateMapper";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import { itemTemplateID, ItemTemplateID } from "@/backend/domain/common/IDs";

/**
 * Implementation of the ItemTemplateRepository interface using SQL queries.
 *
 * Handles the following operations:
 * - Fetching a single template.
 * - Inserting a template.
 */
export class ItemTemplateRepositoryImpl
  extends BaseRepositoryImpl
  implements ItemTemplateRepository
{
  // constructor accepts database instace
  constructor(db: SQLite.SQLiteDatabase) {
    super(db);
  }

  /**
   * Fetches a template by its ID.
   *
   * @param itemTemplateID - An `ItemTemplateID` representing the template ID.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to an `ItemTemplate` if query succeeded.
   * @throws RepositoryError if the fetch fails.
   */
  async getItemTemplateById(
    itemTemplateID: ItemTemplateID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<ItemTemplate> {
    try {
      const template = await super.fetchFirst<ItemTemplateModel>(
        selectItemTemplateByTemplateIDQuery,
        [itemTemplateID],
        txn,
      );
      if (template) {
        return ItemTemplateMapper.toEntity(template);
      } else {
        throw new RepositoryError("Not Found");
      }
    } catch (error) {
      throw new RepositoryError("Fetch Failed");
    }
  }

  /**
   * Inserts a new template into the database.
   *
   * @param itemTemplate - A `NewItemTemplate` object containing the template data.
   * @param txn - The DB instance the operation should be executed on if a transaction is ongoing.
   * @returns A Promise resolving to an `ItemTemplateID` if insertion succeeded.
   * @throws RepositoryError if the insertion fails.
   */
  async insertTemplateAndReturnID(
    itemTemplate: NewItemTemplate,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<ItemTemplateID> {
    try {
      const templateID: number = await this.executeTransaction<number>(
        async (transaction) => {
          await this.executeQuery(
            insertItemTemplateQuery,
            [itemTemplate.templateName],
            txn ?? transaction,
          );

          const lastInsertedID = await this.getLastInsertId(txn ?? transaction);
          return lastInsertedID;
        },
      );
      return itemTemplateID.parse(templateID);
    } catch (error) {
      throw new RepositoryError("Insert Failed");
    }
  }
}
