import React from 'react';
import './Home.css';
import Product from './product';
import product1 from './Components/images/product1.jpg'; 
import product2 from './Components/images/product2.webp'; 
import product3 from './Components/images/product3.webp'; 
import product4 from './Components/images/product4.webp'; 
import jamun from './Components/images/jamun.jpg';
import shop from './Components/images/shopping.gif';
import tom from './Components/images/tom.jpg';

function Home({ onAddToBasket ,onRemoveFromBasket,basket }) {
  const products = [
    {
      id: 1,
      title: 'Bananas',
      image: product1,
      price: 1.99,
      rating: 5
    },
    {
      id: 2,
      title: 'Apples',
      image: product2,
      price: 2.99,
      rating: 4
    },
    {
      id: 3,
      title: 'Oranges',
      image: product3,
      price: 3.99,
      rating: 4
    },
    {
      id: 4,
      title: 'Watermelon',
      image: product4,
      price: 7.99,
      rating: 3
    },
    {
      id: 5,
      title: 'jamun',
      image: jamun,
      price: 2.00,
      rating: 4
    },
    {
      id: 6,
      title: 'gift',
      image: shop,
      price: 7.99,
      rating: 3
    }, {
      id: 7,
      title: 'tom',
      image: tom,
      price: 2.99,
      rating: 4
    },
    {
      id: 8,
      title: 'Bananas',
      image: product1,
      price: 1.99,
      rating: 5
    }
  ];

  const getProductCount = (id) => {
    const product = basket.find((item) => item.id === id);
    return product ? product.quantity : 0;
  };

  return (
    <div className='home'>
      <div className='home__container'>
        {products.map((product) => (
          <Product
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            rating={product.rating}
            image={product.image}
            count={getProductCount(product.id)}
            onAddToBasket={onAddToBasket}
            onRemoveFromBasket={onRemoveFromBasket}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;