import { Tag } from "@/backend/domain/entity/Tag";
import { BaseRepositoryImpl } from "./BaseRepository.implementation";
import { TagRepository } from "../interfaces/TagRepository.interface";
import { selectAllTagsQuery } from "../query/TagQuery";
import { TagMapper } from "@/backend/util/mapper/TagMapper";
import { TagModel } from "../model/TagModel";

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
