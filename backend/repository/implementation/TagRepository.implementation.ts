import { Tag } from "@/backend/domain/entity/Tag";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { TagRepository } from "../interfaces/TagRepository.interface";
import { TagModel } from "@/models/TagModel";
import { selectAllTagsQuery } from "../query/TagQuery";
import { TagMapper } from "@/backend/util/TagMapper";

export class TagRepositoryImpl
  extends BaseRepositoryImpl
  implements TagRepository
{
  async getAllTags(): Promise<Tag[]> {
    const result = await this.fetchAll<TagModel>(selectAllTagsQuery);
    return result.map(TagMapper.toEntity);
  }
}

export const tagRepository = new TagRepositoryImpl();
