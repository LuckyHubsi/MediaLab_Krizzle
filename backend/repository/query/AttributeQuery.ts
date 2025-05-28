const insertAttributeQuery: string = `
    INSERT INTO attribute (attribute_label, type, preview, item_templateID) VALUES (?, ?, ?, ?)
`;

const insertMultiselectOptionsQuery: string = `
    INSERT INTO multiselect_options (options, attributeID) VALUES (?, ?)
`;

const insertRatingSymbolQuery: string = `
    INSERT INTO rating_symbol (symbol, attributeID) VALUES (?, ?)
`;

const updateAttributeQuery: string = `
    UPDATE attribute SET attribute_label = ?, preview = ? WHERE attributeID = ?;
`;

const updateMultiselectOptionsQuery: string = `
    UPDATE multiselect_options SET options = ? WHERE attributeID = ?;
`;

const updateRatingSymbolQuery: string = `
    UPDATE rating_symbol SET symbol = ? WHERE attributeID = ?;
`;

const selectPreviewAttributesQuery: string = `
    SELECT
        a.attributeID,
        a.attribute_label,
        a.type,
        a.preview = 1 AS preview,
         CASE 
            WHEN a.type = 'rating' THEN (
            SELECT rs.symbol
            FROM rating_symbol rs
            WHERE rs.attributeID = a.attributeID
            LIMIT 1
            ) 
            ELSE NULL 
        END AS symbol,
        CASE 
            WHEN a.type = 'multi-select' THEN (
            SELECT mo.options
            FROM multiselect_options mo
            WHERE mo.attributeID = a.attributeID
            LIMIT 1
            )
            ELSE NULL 
        END AS options
    FROM attribute a
    WHERE a.item_templateID = (
        SELECT item_templateID FROM collection WHERE pageID = ?
    )
    AND a.preview = 1
    ORDER BY a.attributeID ASC;
`;

export {
  insertAttributeQuery,
  insertMultiselectOptionsQuery,
  insertRatingSymbolQuery,
  updateAttributeQuery,
  selectPreviewAttributesQuery,
  updateMultiselectOptionsQuery,
  updateRatingSymbolQuery,
};
