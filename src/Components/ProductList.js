// src/Components/ProductList.js
import React, { useEffect, useState } from 'react';
import './ProductList.css'; // Add styles as needed

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product._id} className="product-card">
          <img src={product.imageUrl} alt={product.name} className="product-image" />
          <h3>{product.name}</h3>
          <p>${product.price.toFixed(2)}</p>
          <p>Category: {product.category}</p>
          <p>Rating: {product.rating ? product.rating.toFixed(1) : 'No rating'}</p>
          <p>Quantity Available: {product.quantityAvailable}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
