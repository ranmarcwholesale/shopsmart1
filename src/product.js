import React, { useState } from 'react';
import './Product.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function Product({ id, title, image, price, rating, count, onAddToBasket, onRemoveFromBasket }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Define a fallback image if the image URL is not provided or fails to load
  const fallbackImage = 'http://localhost:5000/images/placeholder.jpg';
  const imageUrl = image || fallbackImage;

  // Ensure price and rating are valid numbers
  const formattedPrice = parseFloat(price) || 0;

  // Parse rating from the string format "4.7 out of 5 stars"
  const parseRating = (rating) => {
    const match = rating.match(/^(\d+(\.\d+)?)\s+out\s+of\s+5\s+stars$/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Calculate the number of full stars and the fractional part
  const formattedRating = parseRating(rating);
  const fullStars = Math.floor(formattedRating);
  const hasFractionalStar = formattedRating - fullStars > 0;

  // Generate rating stars array
  const ratingArray = Array(fullStars).fill('★');
  if (hasFractionalStar) ratingArray.push('☆');

  const handleTitleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddClick = () => {
    onAddToBasket({ id, title, image, price: formattedPrice, rating: formattedRating });
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
        <p
          className={`product__title ${isExpanded ? 'expand' : ''}`}
          onClick={handleTitleClick}
        >
          {isExpanded ? title : (title.length > 40 ? `${title.substring(0, 40)}...` : title)}
        </p>
        <p className='product__price'>
          <small>$</small>
          <strong>{formattedPrice.toFixed(2)}</strong>
        </p>
        <div className='product__rating'>
          {ratingArray.map((star, i) => (
            <span key={i} className={star === '★' ? 'full-star' : 'half-star'}>{star}</span>
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
