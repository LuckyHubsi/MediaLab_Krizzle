const selectAllTagsQuery = `
  SELECT * FROM tag
  ORDER BY tag_label ASC;
`;

export { selectAllTagsQuery };
