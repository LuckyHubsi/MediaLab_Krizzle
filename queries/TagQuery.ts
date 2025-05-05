const selectAllTagsQuery = `
  SELECT * FROM tag
  ORDER BY tag_label ASC;
`;

const insertTagQuery = `
  INSERT INTO tag (tag_label) VALUES (?);
`;

const deleteTagQuery = `
  DELETE FROM tag WHERE tagID = ?
`;
export { selectAllTagsQuery, insertTagQuery, deleteTagQuery };
