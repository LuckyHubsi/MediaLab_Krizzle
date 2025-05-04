import { TagDTO } from "@/dto/TagDTO";
import { NewTag, Tag, tagSchema } from "@/backend/domain/entity/Tag";
import { TagModel } from "@/backend/repository/model/TagModel";
import { z } from "zod";

export class TagMapper {
  static toDTO(entity: Tag): TagDTO {
    return {
      tagID: entity.tagID,
      tag_label: entity.tagLabel,
    };
  }

  static toModel(entity: Tag): TagModel {
    return {
      tagID: entity.tagID,
      tag_label: entity.tagLabel,
    };
  }

  static toNewEntity(dto: TagDTO): NewTag {
    try {
      const parsedDTO = z
        .object({
          tagLabel: z.string().min(1).max(30),
        })
        .parse({ tagLabel: dto.tag_label });
      return {
        tagLabel: parsedDTO.tagLabel,
      };
    } catch (error: any) {
      console.error("Error mapping TagDTO to New Entity:", error.issues);
      throw new Error("Failed to map TagDTO to New Entity");
    }
  }

  static toEntity(model: TagModel): Tag {
    try {
      return tagSchema.parse({
        tagID: model.tagID,
        tagLabel: model.tag_label,
      });
    } catch (error: any) {
      console.error("Error mapping TagModel to Entity:", error.issues);
      throw new Error("Failed to map TagModel to Entity");
    }
  }
}
