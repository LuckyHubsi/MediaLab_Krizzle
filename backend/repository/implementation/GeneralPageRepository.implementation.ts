import {
  GeneralPage,
  NewGeneralPage,
  PageID,
} from "@/backend/domain/entity/GeneralPage";
import { GeneralPageRepository } from "../interfaces/GeneralPageRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { GeneralPageModel } from "@/models/GeneralPageModel";
import { GeneralPageMapper } from "@/backend/util/mapper/GeneralPageMapper";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import {
  deleteGeneralPageByIDQuery,
  insertNewPageQuery,
  selectAllArchivedPagesQuery,
  selectAllPagesByAlphabetQuery,
  selectAllPagesByLastModifiedQuery,
  selectAllPinnedPagesQuery,
  selectGeneralPageByIdQuery,
} from "../query/GeneralPageQuery";
import * as SQLite from "expo-sqlite";
import { GeneralPageState } from "@/shared/enum/GeneralPageState";

export class GeneralPageRepositoryImpl
  extends BaseRepositoryImpl
  implements GeneralPageRepository
{
  async getAllPagesSortedByModified(): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllPagesByLastModifiedQuery,
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError(
        "Failed to fetch all pages sorted by last modified.",
      );
    }
  }

  async getAllPagesSortedByAlphabet(): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllPagesByAlphabetQuery,
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch all pages.");
    }
  }

  async getAllPinnedPages(): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllPinnedPagesQuery,
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch all pages.");
    }
  }

  async getAllArchivedPages(): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllArchivedPagesQuery,
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch all pages.");
    }
  }

  async getByPageID(pageID: PageID): Promise<GeneralPage> {
    try {
      const result = await this.fetchFirst<GeneralPageModel>(
        selectGeneralPageByIdQuery,
      );
      if (result) {
        return GeneralPageMapper.toEntity(result);
      } else {
        throw new RepositoryError("Failed to fetch page by id.");
      }
    } catch (error) {
      throw new RepositoryError("Failed to fetch page by id.");
    }
  }

  async insertPage(
    page: NewGeneralPage,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<number> {
    try {
      const model = GeneralPageMapper.toInsertModel(page);
      const pageID = await super.executeTransaction(async (txn) => {
        await super.executeQuery(
          insertNewPageQuery,
          [
            model.page_type,
            model.page_title,
            model.page_icon,
            model.page_color,
            model.date_created,
            model.date_modified,
            model.archived ? 1 : 0,
            model.pinned ? 1 : 0,
          ],
          txn,
        );

        const lastInsertedID = await super.getLastInsertId(txn);
        return lastInsertedID;
      });
      return pageID;
    } catch (error) {
      throw new RepositoryError("Failed to insert page.");
    }
  }

  async deletePage(pageID: PageID): Promise<boolean> {
    try {
      await super.executeQuery(deleteGeneralPageByIDQuery, [pageID]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to delete teh page");
    }
  }
}

export const generalPageRepository = new GeneralPageRepositoryImpl();
