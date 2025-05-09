import { NewTag, Tag, TagID } from "../../domain/entity/Tag";
import { BaseRepository } from "./BaseRepository.interface";

export interface TagRepository extends BaseRepository {
  getAllTags(): Promise<Tag[]>;
  insertTag(tag: NewTag): Promise<boolean>;
  deleteTag(tagID: TagID): Promise<boolean>;
  updateTag(tag: Tag): Promise<boolean>;
}
