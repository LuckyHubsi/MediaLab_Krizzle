import { folderID } from "@/backend/domain/common/IDs";
import { Folder, NewFolder } from "@/backend/domain/entity/Folder";
import { FolderModel } from "@/backend/repository/model/FolderModel";
import { FolderDTO } from "@/shared/dto/FolderDTO";
import { FolderMapper } from "../FolderMapper";
import { ZodError } from "zod";

describe("FolderMapper", () => {
  const brandedFolderID = folderID.parse(1);

  const folderEntity: Folder = {
    folderID: brandedFolderID,
    folderName: "test folder",
    itemCount: 2,
  };

  const updatedFolderEntity: Folder = {
    folderID: brandedFolderID,
    folderName: "test folder",
    itemCount: 0,
  };

  const newFolderEntity: NewFolder = {
    folderName: "test folder",
  };

  const folderDTO: FolderDTO = {
    folderID: 1,
    folderName: "test folder",
    itemCount: 2,
  };

  const invalidFolderNameDTO: FolderDTO = {
    folderID: 1,
    folderName: "",
  };

  const invalidFolderIdDTO: FolderDTO = {
    folderID: -1,
    folderName: "test folder",
  };

  const folderModel: FolderModel = {
    folderID: 1,
    folder_name: "test folder",
    item_count: 2,
  };

  const invalidFolderNameModel: FolderModel = {
    folderID: 1,
    folder_name: "",
    item_count: 2,
  };

  const invalidFolderIdModel: FolderModel = {
    folderID: -1,
    folder_name: "",
    item_count: 2,
  };

  describe("toDTO", () => {
    it("should map a Folder entity to a FolderDTO", () => {
      const result = FolderMapper.toDTO(folderEntity);
      expect(result).toEqual(folderDTO);
    });
  });

  describe("toNewEntity", () => {
    it("should map a FolderDTO to a NewFolder entity", () => {
      const result = FolderMapper.toNewEntity(folderDTO);
      expect(result).toEqual(newFolderEntity);
    });

    it("should throw an error if FolderDTO folder name is invalid", () => {
      expect(() => FolderMapper.toNewEntity(invalidFolderNameDTO)).toThrow(
        ZodError,
      );
    });
  });

  describe("toUpdatedEntity", () => {
    it("should map a FolderDTO to an updated Folder entity", () => {
      const result = FolderMapper.toUpdatedEntity(folderDTO);
      expect(result).toEqual(updatedFolderEntity);
    });

    it("should throw an error if FolderDTO folder name is invalid", () => {
      expect(() => FolderMapper.toUpdatedEntity(invalidFolderNameDTO)).toThrow(
        ZodError,
      );
    });

    it("should throw an error if FolderDTO folder ID is invalid", () => {
      expect(() => FolderMapper.toUpdatedEntity(invalidFolderIdDTO)).toThrow(
        ZodError,
      );
    });
  });

  describe("toEntity", () => {
    it("should map a FolderModel to a Folder entity", () => {
      const result = FolderMapper.toEntity(folderModel);
      expect(result).toEqual(folderEntity);
    });

    it("should throw an error if FolderModel folder id is invalid", () => {
      expect(() => FolderMapper.toEntity(invalidFolderIdModel)).toThrow(
        ZodError,
      );
    });

    it("should throw an error if FolderModel folder label is invalid", () => {
      expect(() => FolderMapper.toEntity(invalidFolderNameModel)).toThrow(
        ZodError,
      );
    });
  });
});
