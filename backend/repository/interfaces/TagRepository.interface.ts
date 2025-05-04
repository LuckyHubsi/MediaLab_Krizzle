import { Tag } from "../../domain/entity/Tag";
import { BaseRepository } from "./BaseRepository.interface";

export interface TagRepository extends BaseRepository {
  getAllTags(): Promise<Tag[]>;
}
