// Home.js
import React, { useState, useEffect } from 'react';
import './Home.css';

function Home({ onAddToBasket }) {
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [selectedPuff, setSelectedPuff] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [brandDetails, setBrandDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const response = await fetch('https://shopsmart1.onrender.com/data');
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const data = await response.json();
      setProductsData(data);

      // Log each item's Category to confirm the data structure
      data.forEach((item, index) => {
        console.log(`Item ${index + 1}: Category = ${item.Category}`);
      });

      // Automatically filter for 'CategoryImages' on data load
      const uniqueMainCategories = data.filter(item => item.Category === 'CategoryImages');
      setMainCategories(uniqueMainCategories);
      setSelectedCategory(null);
      console.log('Products Data:', data);
      console.log('Main Categories (CategoryImages):', uniqueMainCategories);
    } catch (error) {
      console.error('Failed to fetch or process data:', error);
    }
  };

  const handleCategoryClick = (mainCategory) => {
    console.log('Selected Category:', mainCategory);
    setSelectedCategory(mainCategory.Brand);
    const filteredItems = productsData.filter(item => item.Category === mainCategory.Brand);

    const uniqueBrands = [];
    const brandImages = {};

    filteredItems.forEach(item => {
      if (!brandImages[item.Brand]) {
        brandImages[item.Brand] = item.image;
        uniqueBrands.push({ brand: item.Brand, image: item.image });
      }
    });
    setFilteredBrands(uniqueBrands);
    console.log('Filtered Brands:', uniqueBrands);
  };

  const handleBrandClick = (brand) => {
    console.log('Selected Brand:', brand);
    setSelectedBrand(brand);
    const brandDetails = productsData.filter(item => item.Brand && item.Brand.toLowerCase() === brand.toLowerCase());
    setBrandDetails(brandDetails);
    console.log('Brand Details:', brandDetails);
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const renderMainCategories = () => {
    return (
      <div className="home__categories">
        {mainCategories.map((category, index) => (
          <div key={index} className="home__category" onClick={() => handleCategoryClick(category)}>
            <img src={category.image} alt={category.Brand} className="home__categoryImage" />
            <h2 className="home__categoryTitle">{category.Brand}</h2>
          </div>
        ))}
      </div>
    );
  };

  const renderBrands = () => {
    return (
      <div className="home__brands">
        {filteredBrands.map((brand, index) => (
          <div key={index} className="home__brand" onClick={() => handleBrandClick(brand.brand)}>
            <img src={brand.image} alt={brand.brand} className="home__brandImage" />
            <h3>{brand.brand}</h3>
          </div>
        ))}
      </div>
    );
  };

  const renderBrandDetails = () => {
    if (!brandDetails || brandDetails.length === 0) {
      return <p>No details available for {selectedBrand}.</p>;
    }

    const uniquePuffs = [...new Set(brandDetails.map(item => item.Puffs))];
    const uniqueFlavors = [...new Set(brandDetails.map(item => item.Flavor))];

    return (
      <div className="home__brandDetails">
        <div className="home__brandImage">
          <img src={brandDetails[0].image} alt={selectedBrand} />
        </div>
        <div className="home__brandOptions">
          <h3>{selectedBrand}</h3>
          <div className="home__option">
            <label htmlFor="puffs">Puffs:</label>
            <select
              id="puffs"
              value={selectedPuff}
              onChange={(e) => {
                setSelectedPuff(e.target.value);
                setSelectedFlavor('');
              }}
            >
              <option value="">Select Puff Count</option>
              {uniquePuffs.map((puff, index) => (
                <option key={index} value={puff}>
                  {puff}
                </option>
              ))}
            </select>
          </div>
          {selectedPuff && (
            <div className="home__option">
              <label htmlFor="flavors">Flavors:</label>
              <select id="flavors" value={selectedFlavor} onChange={(e) => setSelectedFlavor(e.target.value)}>
                <option value="">Select Flavor</option>
                {uniqueFlavors.map((flavor, index) => (
                  <option key={index} value={flavor}>
                    {flavor}
                  </option>
                ))}
              </select>
            </div>
          )}
          {selectedPuff && selectedFlavor && (
            <div className="home__quantityControls">
              <button onClick={decrementQuantity} className="quantityButton">-</button>
              <span className="quantityValue">{quantity}</span>
              <button onClick={incrementQuantity} className="quantityButton">+</button>
            </div>
          )}
          {selectedPuff && selectedFlavor && (
            <button
              className="home__addButton"
              onClick={() => {
                const basketItem = {
                  brand: selectedBrand,
                  puffs: selectedPuff,
                  flavor: selectedFlavor,
                  quantity: quantity,
                  image: brandDetails[0]?.image || '/images/placeholder.png'
                };
                console.log('Adding to basket:', basketItem);
                onAddToBasket(basketItem); 
                setQuantity(1);
                setSelectedPuff('');
                setSelectedFlavor('');
              }}
            >
              Add to Basket
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="home">
      <div className="home__container">
        {!selectedCategory ? (
          renderMainCategories()
        ) : !selectedBrand ? (
          <>
            <button className="home__backButton" onClick={() => setSelectedCategory(null)}>
              ← Back to Categories
            </button>
            {renderBrands()}
          </>
        ) : (
          <>
            <button className="home__backButton" onClick={() => setSelectedBrand(null)}>
              ← Back to Brands
            </button>
            {renderBrandDetails()}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
