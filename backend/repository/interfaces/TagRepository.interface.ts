import { TagID } from "@/backend/domain/common/IDs";
import { NewTag, Tag } from "../../domain/entity/Tag";
import { BaseRepository } from "./BaseRepository.interface";

/**
 * TagRepository defines CRUD operations for `Tag` entities.
 *
 * Extends the base repository interface for common infrastructure.
 */
export interface TagRepository extends BaseRepository {
  getAllTags(): Promise<Tag[]>;
  insertTag(tag: NewTag): Promise<boolean>;
  deleteTag(tagID: TagID): Promise<boolean>;
  updateTag(tag: Tag): Promise<boolean>;
}
