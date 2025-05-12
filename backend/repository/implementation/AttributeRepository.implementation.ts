import {
  attributeID,
  AttributeID,
  NewAttribute,
} from "@/backend/domain/common/Attribute";
import * as SQLite from "expo-sqlite";
import { AttributeRepository } from "../interfaces/AttributeRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import {
  insertAttributeQuery,
  insertMultiselectOptionsQuery,
  insertRatingSymbolQuery,
} from "../query/AttributeQuery";
import { ItemTemplateID } from "@/backend/domain/entity/ItemTemplate";
import { AttributeMapper } from "@/backend/util/mapper/AttributeMapper";
import { RepositoryError } from "@/backend/util/error/RepositoryError";

export class AttributeRepositoryImpl
  extends BaseRepositoryImpl
  implements AttributeRepository
{
  async insertAttribute(
    newAttribute: NewAttribute,
    templateID: ItemTemplateID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<AttributeID> {
    try {
      const attribute = AttributeMapper.toInsertModel(newAttribute);
      await super.executeQuery(
        insertAttributeQuery,
        [
          attribute.attribute_label,
          attribute.type,
          attribute.preview,
          templateID,
        ],
        txn,
      );

      const lastInsertedID = await super.getLastInsertId(txn);
      return attributeID.parse(lastInsertedID);
    } catch (error) {
      throw new RepositoryError("Failed to insert attribute.");
    }
  }

  async insertMultiselectOptions(
    options: string[],
    attributeID: AttributeID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await super.executeQuery(
        insertMultiselectOptionsQuery,
        [JSON.stringify(options), attributeID],
        txn,
      );
    } catch (error) {
      throw new RepositoryError("Failed to insert multi-select options.");
    }
  }

  async insertRatingSymbol(
    symbol: string,
    attributeID: AttributeID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      await super.executeQuery(
        insertRatingSymbolQuery,
        [symbol, attributeID],
        txn,
      );
    } catch (error) {
      throw new RepositoryError("Failed to insert rating symbol.");
    }
  }
}

export const attributeRepository = new AttributeRepositoryImpl();
