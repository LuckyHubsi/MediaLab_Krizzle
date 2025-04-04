const itemAttributeValueSelectByItemIdQuery: string = `
    SELECT * FROM item_attribute_values WHERE itemID = ?
`;

const insertItemAttributeValue: string = `
    INSERT INTO item_attribute_values (itemID, attributeID, value) 
    VALUES (?, ?, ?)
`;

const updateItemAttributeValue: string = `
    UPDATE item_attribute_values 
    SET itemID = ?, attributeID = ?, value = ?
    WHERE valueID = ?
`;

export {
    itemAttributeValueSelectByItemIdQuery,
    insertItemAttributeValue,
    updateItemAttributeValue
}