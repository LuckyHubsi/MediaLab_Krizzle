import {
  GeneralPage,
  NewGeneralPage,
  PageID,
} from "@/backend/domain/entity/GeneralPage";
import { BaseRepository } from "./BaseRepository.interface";

export interface GeneralPageRepository extends BaseRepository {
  getAllPages(): Promise<GeneralPage[]>;
  insertPage(page: NewGeneralPage): Promise<number>;
  deletePage(pageID: PageID): Promise<boolean>;
}
