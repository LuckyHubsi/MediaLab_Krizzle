import {
  GeneralPage,
  NewGeneralPage,
  PageID,
} from "@/backend/domain/entity/GeneralPage";
import { GeneralPageRepository } from "../interfaces/GeneralPageRepository.interface";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { GeneralPageModel } from "@/models/GeneralPageModel";
import { selectAllGeneralPageQuery } from "@/queries/GeneralPageQuery";
import { GeneralPageMapper } from "@/backend/util/mapper/GeneralPageMapper";
import { RepositoryError } from "@/backend/util/error/RepositoryError";
import {
  deleteGeneralPageByIDQuery,
  insertNewPageQuery,
} from "../query/GeneralPageQuery";

export class GeneralPageRepositoryImpl
  extends BaseRepositoryImpl
  implements GeneralPageRepository
{
  async getAllPages(): Promise<GeneralPage[]> {
    try {
      const result = await this.fetchAll<GeneralPageModel>(
        selectAllGeneralPageQuery,
      );
      return result.map(GeneralPageMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch all pages.");
    }
  }

  async insertPage(page: NewGeneralPage): Promise<number> {
    try {
      const model = GeneralPageMapper.toInsertModel(page);
      const pageID = super.executeTransaction(async (txn) => {
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
