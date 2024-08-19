const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker'); // Importing faker correctly


mongoose.connect('mongodb://localhost:27017/ShopSmart_DB', { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  rating: Number,
  quantity: Number,
  description: String,
  category: String,
  stock: Number,
});

const Product = mongoose.model('Product', productSchema);

const categories = ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery', 'Beverages'];

async function seedProducts() {
  for (let i = 0; i < 1000; i++) {
    const product = new Product({
      title: faker.commerce.productName(),
      image: faker.image.food(), // Random food images
      price: parseFloat(faker.commerce.price()),
      rating: Math.floor(Math.random() * 5) + 1,
      quantity: Math.floor(Math.random() * 100) + 1,
      description: faker.lorem.sentences(),
      category: categories[Math.floor(Math.random() * categories.length)],
      stock: Math.floor(Math.random() * 1000) + 1,
    });

    await product.save();
  }
  console.log('Products have been seeded.');
  mongoose.disconnect();
}

seedProducts();
