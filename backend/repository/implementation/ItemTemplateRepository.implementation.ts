import {
  ItemTemplate,
  itemTemplateID,
  ItemTemplateID,
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

export class ItemTemplateRepositoryImpl
  extends BaseRepositoryImpl
  implements ItemTemplateRepository
{
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
        throw new RepositoryError("Failed to fetch template.");
      }
    } catch (error) {
      throw new RepositoryError("Failed to fetch template.");
    }
  }

  async insertTemplateAndReturnID(
    itemTemplate: NewItemTemplate,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<ItemTemplateID> {
    try {
      const templateID: number = await super.executeTransaction<number>(
        async () => {
          await super.executeQuery(
            insertItemTemplateQuery,
            [itemTemplate.templateName],
            txn,
          );

          const lastInsertedID = await super.getLastInsertId(txn);
          return lastInsertedID;
        },
      );
      return itemTemplateID.parse(templateID);
    } catch (error) {
      throw new RepositoryError("Failed to save template.");
    }
  }
}
export const templateRepository = new ItemTemplateRepositoryImpl();
