/**
 * Builds a query to fetch an item with all its attributes based on its template
 * @param {number} itemId - The ID of the item to fetch
 * @returns {string} - The SQL query
 */
function itemSelectByIdQuery(itemId: number): string {
  return `
    SELECT 
        i.itemID,
        i.collectionID,
        i.category,
        json_group_array(
            json_object(
                'attributeID', a.attributeID,
                'attributeLabel', a.attribute_label,
                'attributeType', a.type,
                'value', CASE 
                    WHEN a.type = 'text' THEN t.value
                    WHEN a.type = 'date' THEN d.value
                    WHEN a.type = 'rating' THEN r.value
                    WHEN a.type = 'multi-select' THEN (
                        SELECT json_group_array(
                            json_object('multiselectID', mo.multiselectID, 'options', mo.options)
                        )
                        FROM multiselect ms
                        JOIN multiselect_options mo ON mo.multiselectID = ms.multiselectID
                        WHERE ms.attributeID = a.attributeID AND ms.itemID = i.itemID
                    )
                    ELSE NULL
                END,
                'options', CASE 
                    WHEN a.type = 'multiselect' THEN (
                        SELECT json_group_array(
                            json_object('multiselectID', mo.multiselectID, 'options', mo.options)
                        )
                        FROM multiselect_options mo
                        WHERE mo.attributeID = a.attributeID
                    )
                    ELSE NULL
                END
            )
        ) AS attributeValues
    FROM item i
    JOIN collection c ON i.collectionID = c.collectionID
    JOIN item_template it ON c.item_templateID = it.item_templateID
    JOIN attribute a ON it.item_templateID = a.item_templateID
    LEFT JOIN collection_category cc on i.category = cc.category_name
    LEFT JOIN text t ON t.attributeID = a.attributeID AND t.itemID = i.itemID
    LEFT JOIN date d ON d.attributeID = a.attributeID AND d.itemID = i.itemID
    LEFT JOIN rating r ON r.attributeID = a.attributeID AND r.itemID = i.itemID
    WHERE i.itemID = ?
    GROUP BY i.itemID
  `;
}

/*

// TODO: change to function to dynamically build query string based on an array of attributes that are set to preview
const itemSelectByCollectionIdQuery: string = `
    SELECT * FROM items WHERE collectionID = ?
`;

*/

/**
 * Builds a query to fetch all items in a collection
 * @param {number} collectionId - The ID of the collection
 * @returns {string} - The SQL query
 */
function itemSelectByCollectionIdQuery(collectionId: number): string {
  return `
        SELECT 
        i.itemID,
        i.collectionID,
        i.category,
        json_group_array(
            json_object(
                'attributeID', a.attributeID,
                'attributeLabel', a.attribute_label,
                'attributeType', a.type,
                'value', CASE 
                    WHEN a.type = 'text' THEN t.value
                    WHEN a.type = 'date' THEN d.value
                    WHEN a.type = 'rating' THEN r.value
                    WHEN a.type = 'multi-select' THEN (
                        SELECT json_group_array(
                            json_object('multiselectID', mo.multiselectID, 'options', mo.options)
                        )
                        FROM multiselect ms
                        JOIN multiselect_options mo ON mo.multiselectID = ms.multiselectID
                        WHERE ms.attributeID = a.attributeID AND ms.itemID = i.itemID
                    )
                    ELSE NULL
                END,
                'options', CASE 
                    WHEN a.type = 'multiselect' THEN (
                        SELECT json_group_array(
                            json_object('multiselectID', mo.multiselectID, 'options', mo.options)
                        )
                        FROM multiselect_options mo
                        WHERE mo.attributeID = a.attributeID
                    )
                    ELSE NULL
                END
            )
        ) AS attributeValues
    FROM item i
    JOIN collection c ON i.collectionID = c.collectionID
    JOIN item_template it ON c.item_templateID = it.item_templateID
    JOIN attribute a ON it.item_templateID = a.item_templateID
    LEFT JOIN collection_category cc on i.category = cc.category_name
    LEFT JOIN text t ON t.attributeID = a.attributeID AND t.itemID = i.itemID
    LEFT JOIN date d ON d.attributeID = a.attributeID AND d.itemID = i.itemID
    LEFT JOIN rating r ON r.attributeID = a.attributeID AND r.itemID = i.itemID
    WHERE i.collectionID = ? AND a.preview = true
    GROUP BY i.itemID
  `;
}

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
  itemSelectByCollectionIdQuery,
  insertItemQuery,
  insertTextValueQuery,
  insertDateValueQuery,
  insertRatingValueQuery,
  insertMultiselectValueQuery,
  updateItem,
  deleteItem,
};
