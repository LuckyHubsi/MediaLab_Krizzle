import { Tag } from "@/backend/domain/entity/Tag";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { TagRepository } from "../interfaces/TagRepository.interface";
import { selectAllTagsQuery } from "../query/TagQuery";
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
}

export const tagRepository = new TagRepositoryImpl();
