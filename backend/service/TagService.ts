import { TagDTO } from "@/dto/TagDTO";
import { TagRepository } from "../repository/interfaces/TagRepository.interface";
import { tagRepository } from "../repository/implementation/TagRepository.implementation";
import { TagMapper } from "../util/mapper/TagMapper";
import { ServiceError } from "../util/error/ServiceError";
import { NewTag, Tag, tagID, TagID } from "../domain/entity/Tag";

export class TagService {
  constructor(private tagRepo: TagRepository = tagRepository) {}

  async getAllTags(): Promise<TagDTO[]> {
    try {
      const tags = await this.tagRepo.getAllTags();
      return tags.map(TagMapper.toDTO);
    } catch (error) {
      throw new ServiceError("Error retrieving all tags.");
    }
  }

  async insertTag(tagDTO: TagDTO): Promise<boolean> {
    try {
      const tag: NewTag = TagMapper.toNewEntity(tagDTO);
      await this.tagRepo.insertTag(tag);
      return true;
    } catch (error) {
      throw new ServiceError("Error inserting tag.");
    }
  }

  async deleteTagByID(tagId: number): Promise<boolean> {
    try {
      const brandedId: TagID = tagID.parse(tagId);
      await this.tagRepo.deleteTag(brandedId);
      return true;
    } catch (error) {
      throw new ServiceError("Error deleting tag.");
    }
  }

  async updateTag(tagDTO: TagDTO): Promise<boolean> {
    try {
      const tag: Tag = {
        tagID: tagID.parse(tagDTO.tagID),
        tagLabel: tagDTO.tag_label,
        usageCount: 0,
      };

      const tags = await this.tagRepo.updateTag(tag);
      return true;
    } catch (error) {
      throw new ServiceError("Error updating tag.");
    }
  }
}

export const tagService = new TagService();
