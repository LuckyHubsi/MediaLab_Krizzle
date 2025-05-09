import { NewTag, Tag, TagID } from "@/backend/domain/entity/Tag";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { TagRepository } from "../interfaces/TagRepository.interface";
import {
  deleteTagQuery,
  insertTagQuery,
  selectAllTagsQuery,
  updateTagQuery,
} from "../query/TagQuery";
import { TagMapper } from "@/backend/util/mapper/TagMapper";
import { TagModel } from "../model/TagModel";
import { RepositoryError } from "@/backend/util/error/RepositoryError";

export class TagRepositoryImpl
  extends BaseRepositoryImpl
  implements TagRepository
{
  async getAllTags(): Promise<Tag[]> {
    try {
      const result = await this.fetchAll<TagModel>(selectAllTagsQuery);
      return result.map(TagMapper.toEntity);
    } catch (error) {
      throw new RepositoryError("Failed to fetch all tags.");
    }
  }

  async insertTag(tag: NewTag): Promise<boolean> {
    try {
      const result = await this.executeQuery(insertTagQuery, [tag.tagLabel]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to insert tag.");
    }
  }

  async deleteTag(tagID: TagID): Promise<boolean> {
    try {
      const result = await this.executeQuery(deleteTagQuery, [tagID]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to delete tag.");
    }
  }

  async updateTag(tag: Tag): Promise<boolean> {
    try {
      const model: TagModel = TagMapper.toModel(tag);
      const result = await this.executeQuery(updateTagQuery, [
        model.tag_label,
        model.tagID,
      ]);
      return true;
    } catch (error) {
      throw new RepositoryError("Failed to update tag.");
    }
  }
}

export const tagRepository = new TagRepositoryImpl();
