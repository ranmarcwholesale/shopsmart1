import React, { useState } from 'react';
import './Product.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function Product({ id, title, image, price, rating, count, onAddToBasket, onRemoveFromBasket }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className={`product ${isHovered ? 'product--hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={image} alt={title} className='product__image' />
      <div className='product__info'>
        <p className='product__title'>{title}</p>
        <p className='product__price'>
          <small>$</small>
          <strong>{price.toFixed(2)}</strong>
        </p>
        <div className='product__rating'>{rating}</div>
      </div>
      <div className='product__controls'>
        <button className='product__addButton' onClick={() => onAddToBasket({ id, title, price, image, rating })}>
          <AddIcon />
        </button>
      </div>
    </div>
  );
}

export default Product;
