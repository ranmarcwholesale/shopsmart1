import React, { useState, useEffect } from 'react';
import './Home.css';

function Home({ onAddToBasket, searchQuery }) {
  const [mainCategories, setMainCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedQuantityDescription, setSelectedQuantityDescription] = useState('');
  const [selectedPuff, setSelectedPuff] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [brandDetails, setBrandDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);


  
  useEffect(() => {
    fetchProductData();
  }, []);

  // Enhanced search functionality
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();

      const filtered = productsData.filter((product) => {
        const brand = product.Brand?.toLowerCase() || '';
        const flavor = product.Flavor?.toLowerCase() || '';
        const type = product.Type?.toLowerCase() || '';
        const category = product.Category?.toLowerCase() || '';

        // Check if query matches any part of brand, flavor, type, or category
        return (
          brand.includes(query) ||
          flavor.includes(query) ||
          type.includes(query) ||
          category.includes(query)
        );
      });

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, productsData]);

  const fetchProductData = async () => {
    try {
      const response = await fetch('https://shopsmart1.onrender.com/data');
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const data = await response.json();
      setProductsData(data);

      // Automatically filter for 'CategoryImages' on data load
      const uniqueMainCategories = data.filter(
        (item) => item.Category === 'CategoryImages'
      );
      setMainCategories(uniqueMainCategories);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Failed to fetch or process data:', error);
    }
  };

  const handleCategoryClick = (mainCategory) => {
    setSelectedCategory(mainCategory.Brand);
  
    // Filter items based on the selected category
    const filteredItems = productsData.filter(
      (item) => item.Category === mainCategory.Brand
    );
  
    // Use a Map to ensure unique brands with their images
    const uniqueBrandsMap = new Map();
  
    filteredItems.forEach((item) => {
      if (!uniqueBrandsMap.has(item.Brand)) {
        uniqueBrandsMap.set(item.Brand, item.image);
      }
    });
  
    // Convert the Map to an array of brand objects
    const uniqueBrands = Array.from(uniqueBrandsMap, ([brand, image]) => ({
      brand,
      image,
    }));
  
    setFilteredBrands(uniqueBrands);
  };
  

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    const brandDetails = productsData.filter(
      (item) => item.Brand && item.Brand.toLowerCase() === brand.toLowerCase()
    );
    setBrandDetails(brandDetails);
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const renderSearchResults = () => {
    if (filteredProducts.length === 0) {
      return <p>No results found for "{searchQuery}".</p>;
    }
    return (
      <div className="home__searchResults">
        {filteredProducts.map((product, index) => (
          <div key={index} className="home__product">
            <img
              src={product.image}
              alt={product.Brand}
              className="home__productImage"
            />
            <h3>{product.Brand}</h3>
            <p>{product.Flavor}</p>
            <button
              className="home__addButton"
              onClick={() => {
                const basketItem = {
                  brand: product.Brand,
                  flavor: product.Flavor,
                  puffs: product.Puffs,
                  quantity: 1,
                  image: product.image || '/images/placeholder.png',
                };
                onAddToBasket(basketItem);
              }}
            >
              Add to Basket
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderMainCategories = () => {
    return (
      <div className="home__categories">
        {mainCategories.map((category, index) => (
          <div
            key={index}
            className="home__category"
            onClick={() => handleCategoryClick(category)}
          >
            <img
              src={category.image}
              alt={category.Brand}
              className="home__categoryImage"
            />
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
          <div
            key={index}
            className="home__brand"
            onClick={() => handleBrandClick(brand.brand)}
          >
            <img
              src={brand.image}
              alt={brand.brand}
              className="home__brandImage"
            />
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
  
    const isGeneric =
      selectedCategory !== 'Kratom' &&
      selectedCategory !== 'Vapes' &&
      selectedCategory !== 'Cigars' &&
      selectedCategory !== 'Delta/THC';
  
    if (isGeneric) {
      const uniqueTypes = [...new Set(brandDetails.map((item) => item.Type).filter(Boolean))];
      const uniquePuffs = selectedType
        ? [...new Set(brandDetails.filter((item) => item.Type === selectedType).map((item) => item.Puffs).filter(Boolean))]
        : [...new Set(brandDetails.map((item) => item.Puffs).filter(Boolean))];
      const uniqueFlavors = selectedType || selectedPuff
        ? [...new Set(brandDetails
            .filter((item) =>
              (!selectedType || item.Type === selectedType) &&
              (!selectedPuff || item.Puffs === selectedPuff)
            )
            .map((item) => item.Flavor)
            .filter(Boolean))]
        : [...new Set(brandDetails.map((item) => item.Flavor).filter(Boolean))];
  
      return (
        <div className="home__brandDetails">
          <div className="home__brandImage">
            <img src={brandDetails[0].image} alt={selectedBrand} />
          </div>
          <h3>{selectedBrand}</h3>
  
          {/* Type Dropdown */}
          {uniqueTypes.length > 0 && (
            <div className="home__option">
              <label htmlFor="type">Type:</label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedPuff('');
                  setSelectedFlavor('');
                }}
              >
                <option value="">Select Type</option>
                {uniqueTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}
  
          {/* Puffs Dropdown */}
          {uniquePuffs.length > 0 && (
            <div className="home__option">
              <label htmlFor="puffs">Count:</label>
              <select
                id="puffs"
                value={selectedPuff}
                onChange={(e) => {
                  setSelectedPuff(e.target.value);
                  setSelectedFlavor('');
                }}
              >
                <option value="">Select Count</option>
                {uniquePuffs.map((puff, index) => (
                  <option key={index} value={puff}>
                    {puff}
                  </option>
                ))}
              </select>
            </div>
          )}
  
          {/* Flavor Dropdown */}
          {uniqueFlavors.length > 0 && (
            <div className="home__option">
              <label htmlFor="flavors">Flavors:</label>
              <select
                id="flavors"
                value={selectedFlavor}
                onChange={(e) => setSelectedFlavor(e.target.value)}
              >
                <option value="">Select Flavor</option>
                {uniqueFlavors.map((flavor, index) => (
                  <option key={index} value={flavor}>
                    {flavor}
                  </option>
                ))}
              </select>
            </div>
          )}
  
          {/* Quantity Controls */}
          {(!uniqueTypes.length || selectedType) &&
            (!uniquePuffs.length || selectedPuff) &&
            (!uniqueFlavors.length || selectedFlavor) && (
              <div className="home__quantityControls">
                <button
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  className="quantityButton"
                >
                  -
                </button>
                <span className="quantityValue">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="quantityButton"
                >
                  +
                </button>
              </div>
            )}
  
          {/* Add to Basket */}
          {(!uniqueTypes.length || selectedType) &&
            (!uniquePuffs.length || selectedPuff) &&
            (!uniqueFlavors.length || selectedFlavor) && (
              <button
                className="home__addButton"
                onClick={() => {
                  const basketItem = {
                    brand: selectedBrand,
                    type: selectedType || null,
                    puffs: selectedPuff || null,
                    flavor: selectedFlavor || null,
                    quantity: quantity,
                    image: brandDetails[0]?.image || '/images/placeholder.png',
                  };
                  onAddToBasket(basketItem);
                  setQuantity(1);
                  setSelectedType('');
                  setSelectedPuff('');
                  setSelectedFlavor('');
                }}
              >
                Add to Basket
              </button>
            )}
        </div>
      );
    }
  
    const isKratom = selectedCategory === 'Kratom';
    const isCigars = selectedCategory === 'Cigars';
    if (isKratom) {
      const uniqueTypes = [...new Set(brandDetails.map((item) => item.Type))];
      const quantities = selectedType
        ? brandDetails
            .filter((item) => item.Type === selectedType)
            .map((item) => item.Puffs)
        : [];
      const uniqueQuantities = [...new Set(quantities)];
      const flavors =
        selectedType && selectedQuantityDescription
          ? brandDetails
              .filter(
                (item) =>
                  item.Type === selectedType &&
                  item.Puffs === selectedQuantityDescription
              )
              .map((item) => item.Flavor)
          : [];
      const uniqueFlavors = [...new Set(flavors)];

      return (
        <div className="home__brandDetails">
          <div className="home__brandImage">
            <img src={brandDetails[0].image} alt={selectedBrand} />
          </div>
          <div className="home__brandOptions">
            <h3>{selectedBrand}</h3>
            <div className="home__option">
              <label htmlFor="type">Type:</label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setSelectedQuantityDescription('');
                  setSelectedFlavor('');
                }}
              >
                <option value="">Select Type</option>
                {uniqueTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            {selectedType && (
              <div className="home__option">
                <label htmlFor="quantity">Quantity:</label>
                <select
                  id="quantity"
                  value={selectedQuantityDescription}
                  onChange={(e) => {
                    setSelectedQuantityDescription(e.target.value);
                    setSelectedFlavor('');
                  }}
                >
                  <option value="">Select Quantity</option>
                  {uniqueQuantities.map((quantityDesc, index) => (
                    <option key={index} value={quantityDesc}>
                      {quantityDesc}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedType && selectedQuantityDescription && (
              <div className="home__option">
                <label htmlFor="flavors">Flavors:</label>
                <select
                  id="flavors"
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                >
                  <option value="">Select Flavor</option>
                  {uniqueFlavors.map((flavor, index) => (
                    <option key={index} value={flavor}>
                      {flavor}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedType &&
              selectedQuantityDescription &&
              selectedFlavor && (
                <div className="home__quantityControls">
                  <button
                    onClick={decrementQuantity}
                    className="quantityButton"
                  >
                    -
                  </button>
                  <span className="quantityValue">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="quantityButton"
                  >
                    +
                  </button>
                </div>
              )}
            {selectedType &&
              selectedQuantityDescription &&
              selectedFlavor && (
                <button
                  className="home__addButton"
                  onClick={() => {
                    const basketItem = {
                      brand: selectedBrand,
                      type: selectedType,
                      flavor: `${selectedFlavor} (${selectedQuantityDescription})`,
                      quantity: quantity,
                      image: brandDetails[0]?.image || '/images/placeholder.png',
                    };
                    onAddToBasket(basketItem);
                    setQuantity(1);
                    setSelectedType('');
                    setSelectedQuantityDescription('');
                    setSelectedFlavor('');
                  }}
                >
                  Add to Basket
                </button>
              )}
          </div>
        </div>
      );
    } else {
      const uniquePuffs = [
        ...new Set(brandDetails.map((item) => item.Puffs)),
      ];
      const uniqueFlavors = [
        ...new Set(brandDetails.map((item) => item.Flavor)),
      ];

      return (
        <div className="home__brandDetails">
          <div className="home__brandImage">
            <img src={brandDetails[0].image} alt={selectedBrand} />
          </div>
          <div className="home__brandOptions">
            <h3>{selectedBrand}</h3>
            {!isCigars && (
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
            )}
            {(isCigars || selectedPuff) && (
              <div className="home__option">
                <label htmlFor="flavors">Flavors:</label>
                <select
                  id="flavors"
                  value={selectedFlavor}
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                >
                  <option value="">Select Flavor</option>
                  {uniqueFlavors.map((flavor, index) => (
                    <option key={index} value={flavor}>
                      {flavor}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {((isCigars && selectedFlavor) ||
              (selectedPuff && selectedFlavor)) && (
              <div className="home__quantityControls">
                <button
                  onClick={decrementQuantity}
                  className="quantityButton"
                >
                  -
                </button>
                <span className="quantityValue">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="quantityButton"
                >
                  +
                </button>
              </div>
            )}
            {((isCigars && selectedFlavor) ||
              (selectedPuff && selectedFlavor)) && (
              <button
                className="home__addButton"
                onClick={() => {
                  const basketItem = {
                    brand: selectedBrand,
                    flavor: selectedFlavor,
                    puffs: isCigars ? null : selectedPuff,
                    quantity: quantity,
                    image: brandDetails[0]?.image || '/images/placeholder.png',
                  };
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
    }
  };

  return (
    <div className="home">
      <div className="home__container">
        {searchQuery ? (
          renderSearchResults()
        ) : !selectedCategory ? (
          renderMainCategories()
        ) : !selectedBrand ? (
          <>
            <button
              className="home__backButton"
              onClick={() => setSelectedCategory(null)}
            >
              ← Back to Categories
            </button>
            {renderBrands()}
          </>
        ) : (
          <>
            <button
              className="home__backButton"
              onClick={() => setSelectedBrand(null)}
            >
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

