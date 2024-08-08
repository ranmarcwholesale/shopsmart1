import React from 'react';
import './Product.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function Product({ id, title, image, price, rating, count, onAddToBasket, onRemoveFromBasket }) {
  
  // Define a fallback image if the image URL is not provided or fails to load
  const fallbackImage = 'http://localhost:5000/images/placeholder.jpg'; // Ensure this placeholder image exists in your static folder

  // Log image and constructed URL
  console.log('Image:', image);
  const imageUrl = image ? `http://localhost:5000/images/${image}` : fallbackImage;
  console.log('Image URL:', imageUrl);

  const handleAddClick = () => {
    onAddToBasket({ id, title, image, price, rating });
  };

  const handleRemoveClick = () => {
    if (count > 0) {
      onRemoveFromBasket({ id });
    }
  };

  return (
    <div className='product'>
      <img src={imageUrl} alt={title} className='product__image' />
      <div className='product__info'>
        <p className='product__title'>{title}</p>
        <p className='product__price'>
          <small>$</small>
          <strong>{price.toFixed(2)}</strong>
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
