import {
  GeneralPage,
  NewGeneralPage,
  pageID,
  PageID,
} from "@/backend/domain/entity/GeneralPage";
import { GeneralPageRepository } from "../interfaces/GeneralPageRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
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
  updateArchivedByPageIDQuery,
  updateDateModifiedByPageIDQuery,
  updatePageByIDQuery,
  updatePinnedByPageIDQuery,
} from "../query/GeneralPageQuery";
import * as SQLite from "expo-sqlite";
import { GeneralPageState } from "@/shared/enum/GeneralPageState";
import { GeneralPageModel } from "../model/GeneralPageModel";

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

  async updateGeneralPageData(
    pageID: PageID,
    updatedPage: NewGeneralPage,
  ): Promise<boolean> {
    try {
      const pageModel: GeneralPageModel =
        GeneralPageMapper.toInsertModel(updatedPage);
      await this.executeQuery(updatePageByIDQuery, [
        pageModel.page_title,
        pageModel.page_icon,
        pageModel.page_color,
        pageModel.tagID,
        pageModel.date_modified,
        pageID,
      ]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to update page.");
    }
  }

  async insertPage(
    page: NewGeneralPage,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<PageID> {
    try {
      const model = GeneralPageMapper.toInsertModel(page);
      const pageId = await super.executeTransaction(async (txn) => {
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
      return pageID.parse(pageId);
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

  async updatePin(pageID: PageID, currentPinStatus: boolean): Promise<boolean> {
    try {
      const newPinStatus = currentPinStatus ? 0 : 1;

      await this.executeTransaction(async (txn) => {
        await this.executeQuery(
          updatePinnedByPageIDQuery,
          [newPinStatus, pageID],
          txn,
        );

        const modfiedAt = new Date();
        await this.executeQuery(
          updateDateModifiedByPageIDQuery,
          [modfiedAt.toISOString(), pageID],
          txn,
        );
      });

      return true;
    } catch (error) {
      throw new RepositoryError("Failed to update pinned state");
    }
  }

  async updateArchive(
    pageID: PageID,
    currentArchiveStatus: boolean,
  ): Promise<boolean> {
    try {
      const newArchiveStatus = currentArchiveStatus ? 0 : 1;

      await this.executeTransaction(async (txn) => {
        await this.executeQuery(
          updateArchivedByPageIDQuery,
          [newArchiveStatus, 0, pageID],
          txn,
        );

        const modfiedAt = new Date();
        await this.executeQuery(
          updateDateModifiedByPageIDQuery,
          [modfiedAt.toISOString(), pageID],
          txn,
        );
      });

      return true;
    } catch (error) {
      throw new RepositoryError("Failed to update pinned state");
    }
  }

  async updateDateModified(
    pageId: PageID,
    txn?: SQLite.SQLiteDatabase,
  ): Promise<void> {
    try {
      const modfiedAt = new Date();
      await this.executeQuery(
        updateDateModifiedByPageIDQuery,
        [modfiedAt.toISOString(), pageID],
        txn,
      );
    } catch (error) {
      throw new RepositoryError("Failed to update last modified date");
    }
  }
}

export const generalPageRepository = new GeneralPageRepositoryImpl();
