const insertFolderQuery = `
  INSERT INTO folder (folder_name) VALUES (?);
`;

const selectAllFoldersQuery = `
  SELECT folder.*, COUNT(general_page_data.parent_folderID) AS item_count
  FROM folder
  LEFT JOIN general_page_data ON folder.folderID = general_page_data.parent_folderID
  GROUP BY folder.folderID;
`;

export { insertFolderQuery, selectAllFoldersQuery };
