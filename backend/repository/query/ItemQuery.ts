const itemSelectByIdQuery: string = `
    SELECT
        i.itemID,
        i.pageID,
        i.categoryID,
        p.page_title,
        cc.category_name,
        (
            SELECT json_group_array(
                json_object(
                    'attributeID', a.attributeID,
                    'attributeLabel', a.attribute_label,
                    'attributeType', a.type,
                    'preview', a.preview,
                    'valueID', CASE
                        WHEN a.type = 'text' THEN t.text_valueID
                        WHEN a.type = 'date' THEN d.date_valueID
                        WHEN a.type = 'rating' THEN r.rating_valueID
                        WHEN a.type = 'multi-select' THEN ms.multiselect_valueID
                    END,
                    'value', CASE
                        WHEN a.type = 'text' THEN t.value
                        WHEN a.type = 'date' THEN d.value
                        WHEN a.type = 'rating' THEN r.value
                        WHEN a.type = 'multi-select' THEN ms.value
                        ELSE NULL
                    END,
                    'symbol', CASE
                        WHEN a.type = 'rating' THEN (
                            SELECT rs.symbol
                            FROM rating_symbol rs
                            WHERE rs.attributeID = a.attributeID
                        )
                        ELSE NULL
                    END,
                    'options', CASE
                        WHEN a.type = 'multi-select' THEN (
                            SELECT json_group_array(mo.options)
                            FROM multiselect_options mo
                            WHERE mo.attributeID = a.attributeID
                        )
                        ELSE NULL
                    END
                )
            )
            FROM attribute a
            LEFT JOIN text_value t ON t.attributeID = a.attributeID AND t.itemID = i.itemID
            LEFT JOIN date_value d ON d.attributeID = a.attributeID AND d.itemID = i.itemID
            LEFT JOIN rating_value r ON r.attributeID = a.attributeID AND r.itemID = i.itemID
            LEFT JOIN multiselect_values ms ON ms.attributeID = a.attributeID AND ms.itemID = i.itemID
            WHERE a.item_templateID = it.item_templateID
            ORDER BY a.attributeID
        ) AS attribute_values
    FROM item i
    JOIN general_page_data p ON i.pageID = p.pageID
    LEFT JOIN collection_category cc ON i.categoryID = cc.collection_categoryID
    LEFT JOIN collection c ON c.pageID = i.pageID
    LEFT JOIN item_template it ON c.item_templateID = it.item_templateID
    WHERE i.itemID = ?
    GROUP BY i.itemID;
`;

const itemSelectByPageIdQuery: string = `
    SELECT
        c.collectionID,
        c.pageID,
        a.attributeID,
        a.attribute_label,
        a.type,
        a.preview,
        i.categoryID,
        cc.category_name,
        rs.symbol AS rating_symbol,
        (
            SELECT json_group_array(mo.options)
            FROM multiselect_options mo
            WHERE mo.attributeID = a.attributeID
        ) AS multiselect_options,
        i.itemID,
        CASE
            WHEN a.type = 'text' THEN t.value
            WHEN a.type = 'date' THEN d.value
            WHEN a.type = 'rating' THEN r.value
            WHEN a.type = 'multi-select' THEN ms.value
            ELSE NULL
        END AS value
    FROM item i
    LEFT JOIN collection_category cc ON i.categoryID = cc.collection_categoryID
    LEFT JOIN collection c ON i.pageID = c.pageID 
    LEFT JOIN attribute a ON a.item_templateID = c.item_templateID
    LEFT JOIN text_value t ON t.attributeID = a.attributeID AND t.itemID = i.itemID
    LEFT JOIN date_value d ON d.attributeID = a.attributeID AND d.itemID = i.itemID
    LEFT JOIN rating_value r ON r.attributeID = a.attributeID AND r.itemID = i.itemID
    LEFT JOIN multiselect_values ms ON ms.attributeID = a.attributeID AND ms.itemID = i.itemID
    LEFT JOIN rating_symbol rs ON rs.attributeID = a.attributeID
    WHERE c.pageID = ?
    AND a.preview = 1
    ORDER BY a.attributeID ASC, i.itemID ASC;
`;

const selectItemPreviewValuesQuery: string = `
    SELECT
    i.itemID,
    i.categoryID,
    cc.category_name AS categoryName,
    a.attributeID,
    a.type,
    CASE
        WHEN a.type = 'text' THEN tv.value
        WHEN a.type = 'date' THEN dv.value
        WHEN a.type = 'rating' THEN rv.value
        WHEN a.type = 'multi-select' THEN msv.value
        ELSE NULL
    END AS value
    FROM item i
    JOIN collection c ON i.pageID = c.pageID
    JOIN attribute a ON a.item_templateID = c.item_templateID
    LEFT JOIN collection_category cc ON cc.collection_categoryID = i.categoryID
    LEFT JOIN text_value tv ON tv.itemID = i.itemID AND tv.attributeID = a.attributeID
    LEFT JOIN date_value dv ON dv.itemID = i.itemID AND dv.attributeID = a.attributeID
    LEFT JOIN rating_value rv ON rv.itemID = i.itemID AND rv.attributeID = a.attributeID
    LEFT JOIN multiselect_values msv ON msv.itemID = i.itemID AND msv.attributeID = a.attributeID
    WHERE c.pageID = ?
    AND a.preview = 1
    ORDER BY i.itemID, a.attributeID;
`;

const insertItemQuery: string = `
    INSERT INTO item (pageID, categoryID) VALUES (?, ?)
`;

const insertTextValueQuery: string = `
    INSERT INTO text_value (itemID, attributeID, value) VALUES (?, ?, ?)
`;

const insertDateValueQuery: string = `
    INSERT INTO date_value (itemID, attributeID, value) VALUES (?, ?, ?)
`;

const insertRatingValueQuery: string = `
    INSERT INTO rating_value (itemID, attributeID, value) VALUES (?, ?, ?)
`;

const insertMultiselectValueQuery: string = `
    INSERT INTO multiselect_values (itemID, attributeID, value) VALUES (?, ?, ?)
`;

const updateItemQuery: string = `
    UPDATE item 
    SET categoryID = ?
    WHERE itemID = ?
`;

const updateTextValueQuery: string = `
    UPDATE text_value SET value = ? WHERE itemID = ? AND attributeID = ?
`;

const updateDateValueQuery: string = `
    UPDATE date_value SET value = ? WHERE itemID = ? AND attributeID = ?
`;

const updateRatingValueQuery: string = `
    UPDATE rating_value SET value = ? WHERE itemID = ? AND attributeID = ?
`;

const updateMultiselectValueQuery: string = `
    UPDATE multiselect_values SET value = ? WHERE itemID = ? AND attributeID = ?
`;

const deleteItemQuery: string = `
    DELETE FROM item WHERE itemID = ? RETURNING pageID
`;

const deleteItemAttributeValuesQuery: string = `
    DELETE FROM text_value WHERE itemID = ?;
    DELETE FROM date_value WHERE itemID = ?;
    DELETE FROM rating_value WHERE itemID = ?;
    DELETE FROM multiselect_values WHERE itemID = ?;
`;

export {
  itemSelectByIdQuery,
  itemSelectByPageIdQuery,
  selectItemPreviewValuesQuery,
  insertItemQuery,
  insertTextValueQuery,
  insertDateValueQuery,
  insertRatingValueQuery,
  insertMultiselectValueQuery,
  updateItemQuery,
  updateTextValueQuery,
  updateRatingValueQuery,
  updateDateValueQuery,
  updateMultiselectValueQuery,
  deleteItemQuery,
  deleteItemAttributeValuesQuery,
};
