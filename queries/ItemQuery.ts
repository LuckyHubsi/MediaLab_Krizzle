/**
 * Builds a query to fetch an item with all its attributes based on its template
 * @param {number} itemId - The ID of the item to fetch
 * @returns {string} - The SQL query
 */
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
        ) AS attributes
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

const updateItem: string = `
    UPDATE items 
    SET category = ?
    WHERE itemID = ?
`;

const deleteItem: string = `
    DELETE FROM items WHERE itemID = ?
`;

export {
  itemSelectByIdQuery,
  itemSelectByPageIdQuery,
  insertItemQuery,
  insertTextValueQuery,
  insertDateValueQuery,
  insertRatingValueQuery,
  insertMultiselectValueQuery,
  updateItem,
  deleteItem,
};
