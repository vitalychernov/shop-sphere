import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../src/models/product.model';

dotenv.config();

const products = [
  {
    name: 'Classic White Sneakers',
    description: 'Timeless white sneakers crafted from premium leather. Comfortable for everyday wear.',
    price: 89.99,
    images: ['https://placehold.co/600x400?text=White+Sneakers'],
    category: 'sneakers',
    stock: 50,
    slug: 'classic-white-sneakers',
  },
  {
    name: 'Black Running Shoes',
    description: 'Lightweight and breathable running shoes with superior cushioning for long runs.',
    price: 119.99,
    images: ['https://placehold.co/600x400?text=Black+Running+Shoes'],
    category: 'sneakers',
    stock: 35,
    slug: 'black-running-shoes',
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Compact genuine leather crossbody bag with adjustable strap. Perfect for daily use.',
    price: 149.99,
    images: ['https://placehold.co/600x400?text=Crossbody+Bag'],
    category: 'bags',
    stock: 20,
    slug: 'leather-crossbody-bag',
  },
  {
    name: 'Canvas Tote Bag',
    description: 'Durable canvas tote bag with inner pockets. Eco-friendly and spacious.',
    price: 39.99,
    images: ['https://placehold.co/600x400?text=Canvas+Tote'],
    category: 'bags',
    stock: 60,
    slug: 'canvas-tote-bag',
  },
  {
    name: 'Aviator Sunglasses',
    description: 'Classic aviator sunglasses with UV400 protection and stainless steel frame.',
    price: 59.99,
    images: ['https://placehold.co/600x400?text=Aviator+Sunglasses'],
    category: 'accessories',
    stock: 45,
    slug: 'aviator-sunglasses',
  },
  {
    name: 'Minimalist Watch',
    description: 'Slim minimalist watch with genuine leather strap and sapphire crystal glass.',
    price: 199.99,
    images: ['https://placehold.co/600x400?text=Minimalist+Watch'],
    category: 'accessories',
    stock: 15,
    slug: 'minimalist-watch',
  },
  {
    name: 'Cotton Crew Sweatshirt',
    description: 'Heavyweight 100% cotton crew neck sweatshirt. Pre-shrunk for a perfect fit.',
    price: 69.99,
    images: ['https://placehold.co/600x400?text=Crew+Sweatshirt'],
    category: 'clothing',
    stock: 80,
    slug: 'cotton-crew-sweatshirt',
  },
  {
    name: 'Slim Fit Chinos',
    description: 'Stretch slim fit chino pants. Wrinkle-resistant fabric for a polished look.',
    price: 79.99,
    images: ['https://placehold.co/600x400?text=Slim+Chinos'],
    category: 'clothing',
    stock: 55,
    slug: 'slim-fit-chinos',
  },
  {
    name: 'Wireless Headphones',
    description: 'Over-ear wireless headphones with 30-hour battery life and active noise cancellation.',
    price: 249.99,
    images: ['https://placehold.co/600x400?text=Headphones'],
    category: 'electronics',
    stock: 25,
    slug: 'wireless-headphones',
  },
  {
    name: 'Portable Charger 20000mAh',
    description: 'High-capacity portable charger with dual USB-C and USB-A ports. Fast charging support.',
    price: 49.99,
    images: ['https://placehold.co/600x400?text=Portable+Charger'],
    category: 'electronics',
    stock: 40,
    slug: 'portable-charger-20000mah',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing products to avoid duplicates on re-run
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
