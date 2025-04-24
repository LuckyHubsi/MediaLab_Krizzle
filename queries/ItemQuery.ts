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
                    WHEN a.type = 'text' THEN (SELECT value FROM text WHERE attributeID = a.attributeID AND itemID = i.itemID)
                    WHEN a.type = 'date' THEN (SELECT value FROM date WHERE attributeID = a.attributeID AND itemID = i.itemID)
                    WHEN a.type = 'rating' THEN (SELECT value FROM rating WHERE attributeID = a.attributeID AND itemID = i.itemID)
                    WHEN a.type = 'multiselect' THEN (
                        SELECT mo.options
                        FROM multiselect ms
                        JOIN multiselect_options mo ON ms.multiselectID = mo.multiselectID
                        WHERE ms.itemID = i.itemID AND ms.attributeID = a.attributeID
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
    LEFT JOIN collection_category cc on i.category = cc.category_name
    JOIN item_template it ON c.item_templateID = it.item_templateID
    JOIN attribute a ON it.item_templateID = a.item_templateID
    WHERE i.itemID = ?
    GROUP BY i.itemID
  `;
}

// TODO: change to function to dynamically build query string based on an array of attributes that are set to preview
const itemSelectByCollectionIdQuery: string = `
    SELECT * FROM items WHERE collectionID = ?
`;

const insertItem: string = `
    INSERT INTO items (collectionID, pageID, category) 
    VALUES (?, ?, ?)
`;

// TODO: write query to insert individual values dependent on attribute type into corresponding table as well

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
    insertItem,
    updateItem,
    deleteItem
}