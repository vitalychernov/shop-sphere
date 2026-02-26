import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../src/models/product.model';

dotenv.config();

const products = [
  {
    name: 'Classic White Sneakers',
    description: 'Timeless white sneakers crafted from premium leather. Comfortable for everyday wear with a clean, minimalist silhouette that pairs with anything.',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    category: 'sneakers',
    stock: 50,
    slug: 'classic-white-sneakers',
  },
  {
    name: 'Black Running Shoes',
    description: 'Lightweight and breathable running shoes with superior cushioning for long runs. Engineered mesh upper keeps your feet cool.',
    price: 119.99,
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'],
    category: 'sneakers',
    stock: 35,
    slug: 'black-running-shoes',
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Compact genuine leather crossbody bag with adjustable strap and multiple compartments. Perfect for everyday use.',
    price: 149.99,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],
    category: 'bags',
    stock: 20,
    slug: 'leather-crossbody-bag',
  },
  {
    name: 'Canvas Tote Bag',
    description: 'Durable canvas tote bag with inner pockets and reinforced handles. Eco-friendly, spacious and stylish.',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80'],
    category: 'bags',
    stock: 60,
    slug: 'canvas-tote-bag',
  },
  {
    name: 'Aviator Sunglasses',
    description: 'Classic aviator sunglasses with UV400 protection and stainless steel frame. Timeless design that never goes out of style.',
    price: 59.99,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80'],
    category: 'accessories',
    stock: 45,
    slug: 'aviator-sunglasses',
  },
  {
    name: 'Minimalist Watch',
    description: 'Slim minimalist watch with genuine leather strap and sapphire crystal glass. Swiss quartz movement for precise timekeeping.',
    price: 199.99,
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80'],
    category: 'accessories',
    stock: 15,
    slug: 'minimalist-watch',
  },
  {
    name: 'Cotton Crew Sweatshirt',
    description: 'Heavyweight 100% cotton crew neck sweatshirt. Pre-shrunk and garment-washed for a perfectly broken-in feel from day one.',
    price: 69.99,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80'],
    category: 'clothing',
    stock: 80,
    slug: 'cotton-crew-sweatshirt',
  },
  {
    name: 'Slim Fit Chinos',
    description: 'Stretch slim fit chino pants in wrinkle-resistant fabric. A polished look that transitions effortlessly from office to weekend.',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80'],
    category: 'clothing',
    stock: 55,
    slug: 'slim-fit-chinos',
  },
  {
    name: 'Wireless Headphones',
    description: 'Over-ear wireless headphones with 30-hour battery life and active noise cancellation. Premium audio quality for work and play.',
    price: 249.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    category: 'electronics',
    stock: 25,
    slug: 'wireless-headphones',
  },
  {
    name: 'Portable Charger 20000mAh',
    description: 'High-capacity portable charger with dual USB-C and USB-A ports. Fast charging support keeps all your devices powered on the go.',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80'],
    category: 'electronics',
    stock: 40,
    slug: 'portable-charger-20000mah',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
