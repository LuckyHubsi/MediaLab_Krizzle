import { CollectionDTO } from "@/dto/CollectionDTO";
import { collectionRepository } from "../repository/implementation/CollectionRepository.implementation";
import { generalPageRepository } from "../repository/implementation/GeneralPageRepository.implementation";
import { CollectionRepository } from "../repository/interfaces/CollectionRepository.interface";
import { GeneralPageRepository } from "../repository/interfaces/GeneralPageRepository.interface";
import { pageID } from "../domain/entity/GeneralPage";
import { ServiceError } from "../util/error/ServiceError";
import { CollectionMapper } from "../util/mapper/CollectionMapper";

export class CollectionService {
  constructor(
    private collectionRepo: CollectionRepository = collectionRepository,
    private generalPageRepo: GeneralPageRepository = generalPageRepository,
  ) {}

  async getCollectionByPageId(pageId: number): Promise<CollectionDTO> {
    try {
      const collection = await this.collectionRepo.getCollection(
        pageID.parse(pageId),
      );
      if (!collection) {
        throw new ServiceError("Note not found.");
      }
      return CollectionMapper.toDTO(collection);
    } catch (error) {
      throw new ServiceError("Failed to retrieve note.");
    }
  }
}

export const collectionService = new CollectionService();
