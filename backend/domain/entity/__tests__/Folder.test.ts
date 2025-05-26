import { folderID } from "../../common/IDs";
import { createNewFolderSchema, folderSchema } from "../Folder";

describe("Folder Schema Validation", () => {
  const validFolder = {
    folderID: 1,
    folderName: "test folder",
    itemCount: 1,
  };
  let invalidFolder: any;

  const validNewFolder = {
    folderName: "test folder",
  };
  let invalidNewFolder: any;

  beforeEach(() => {
    jest.clearAllMocks();
    invalidFolder = { ...validFolder };
    invalidNewFolder = { ...validNewFolder };
  });

  describe("folderSchema", () => {
    it("should validate a correct Folder object", () => {
      const result = folderSchema.safeParse(validFolder);
      expect(result.success).toBe(true);
    });

    // invalidated Folder object cases
    it("should invalidate when incorrect folderID", () => {
      invalidFolder.folderID = -1;
      const result = folderSchema.safeParse(invalidFolder);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect folderName", () => {
      invalidFolder.folderName = "";
      const result = folderSchema.safeParse(invalidFolder);
      expect(result.success).toBe(false);
    });
    it("should invalidate when incorrect itemCount", () => {
      invalidFolder.itemCount = -1;
      const result = folderSchema.safeParse(invalidFolder);
      expect(result.success).toBe(false);
    });
  });

  describe("createNewGeneralPage", () => {
    it("should validate a correct GeneralPage object", () => {
      const result = createNewFolderSchema.safeParse(validNewFolder);
      expect(result.success).toBe(true);
    });

    // invalidated GeneralPage object cases
    it("should invalidate when incorrect folderName", () => {
      invalidNewFolder.folderName = "";
      const result = createNewFolderSchema.safeParse(invalidNewFolder);
      expect(result.success).toBe(false);
    });
  });
});
