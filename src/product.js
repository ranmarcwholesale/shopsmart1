import React, { useState } from 'react';
import './Product.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function Product({ id, title, image, price, rating,onAddToBasket,onRemoveFromBasket  }) {
  const [count, setCount] = useState(0);
  const handleAddClick = () => {
    setCount(count + 1);
    onAddToBasket({ id, title, image, price, rating });
    

  
  };

  const handleRemoveClick = () => {
    if (count > 0) {
      setCount(count - 1);
      onRemoveFromBasket({ id });
      
    }
    
  };

  return (
    <div className='product'>
      <img src={image} alt={title} />
      <div className='product__info'>
        <p>{title}</p>
        <p className='product__price'>
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className='product__rating'>
          {Array(rating)
            .fill()
            .map((_, i) => (
              <span key={i}>★</span>
            ))}
        </div>
      </div>
      <div className='product__controls'>
        {count === 0 ? (
          <button className='product__addButton' onClick={handleAddClick}>
            <AddIcon />
          </button>
        ) : (
          <div className='product__counter'>
            <button className='product__removeButton' onClick={handleRemoveClick}>
              <RemoveIcon />
            </button>
            <span className='product__count'>{count}</span>
            <button className='product__addButton' onClick={handleAddClick}>
              <AddIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
