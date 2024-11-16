import React from 'react';

const ShoppingList = ({ shoppingList }) => {
    return (
        <div className="shopping-list">
            <h2>Shopping List</h2>
            <ul>
                {shoppingList.map((item, index) => (
                    <li key={index}>
                        {item.quantity} {item.unit} of {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShoppingList;
