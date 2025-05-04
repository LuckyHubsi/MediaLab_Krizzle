import { TagDTO } from "@/dto/TagDTO";
import { TagRepository } from "../repository/interfaces/TagRepository.interface";
import { tagRepository } from "../repository/implementation/TagRepository.implementation";
import { TagMapper } from "../util/TagMapper";
import { ServiceError } from "../util/error/ServiceError";

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
}

export const tagService = new TagService();
