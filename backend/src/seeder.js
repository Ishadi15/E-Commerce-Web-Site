const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  // Men
  {
    title: 'Classic White Tee',
    description: 'A timeless, premium organic cotton crew-neck t-shirt. Breathable, super-soft and tailored for everyday style.',
    price: 29.99,
    category: 'Men',
    brand: 'FashionStore Originals',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    countInStock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_1' }]
  },
  {
    title: 'Urban Graphic Hoodie',
    description: 'Heavyweight fleece-lined pullover hoodie with minimal modern graphic art. Designed with kangaroo pockets and rib cuffs.',
    price: 65.00,
    category: 'Men',
    brand: 'StreetVibe',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    countInStock: 18,
    images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_2' }]
  },
  {
    title: 'Casual Denim Button-Down',
    description: 'Light-wash denim shirt made from durable ring-spun cotton. Perfect for layering over a tee or buttoned up with chinos.',
    price: 45.00,
    category: 'Men',
    brand: 'FashionStore Originals',
    sizes: ['S', 'M', 'L'],
    colors: ['Blue'],
    countInStock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_3' }]
  },
  {
    title: 'Slim Fit Stretch Chinos',
    description: 'Modern slim silhouette crafted with 98% cotton and 2% elastane for flexible movement and sharp tailoring.',
    price: 55.00,
    category: 'Men',
    brand: 'UrbanTailor',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige'],
    countInStock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_4' }]
  },
  {
    title: 'Navy Blue Tailored Blazer',
    description: 'Sharp two-button formal blazer with notch lapel, structured shoulders, and breathable interior lining.',
    price: 150.00,
    category: 'Men',
    brand: 'SavileRow',
    sizes: ['M', 'L', 'XL'],
    colors: ['Navy'],
    countInStock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_5' }]
  },

  // Women
  {
    title: 'Vintage Trucker Denim Jacket',
    description: 'Iconic oversized trucker jacket in authentic stonewash denim with distressed copper hardware.',
    price: 89.99,
    category: 'Women',
    brand: 'DenimCo',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blue'],
    countInStock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_6' }]
  },
  {
    title: 'Summer Floral Wrap Dress',
    description: 'Breezy chiffon dress featuring subtle floral motifs, v-neck wrap bodice, and ruffled hem.',
    price: 59.99,
    category: 'Women',
    brand: 'Bloom & Co',
    sizes: ['S', 'M', 'L'],
    colors: ['Red'],
    countInStock: 14,
    images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_7' }]
  },
  {
    title: 'Elegant Midnight Evening Gown',
    description: 'Luxurious floor-length evening silhouette with sleek backless detail and subtle side slit.',
    price: 199.99,
    category: 'Women',
    brand: 'HauteCouture',
    sizes: ['XS', 'S', 'M'],
    colors: ['Black'],
    countInStock: 8,
    images: [{ url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_8' }]
  },
  {
    title: 'High-Waist Ankle Flare Jeans',
    description: 'Figure-sculpting denim with a high-rise waist and clean flare leg silhouette.',
    price: 75.00,
    category: 'Women',
    brand: 'DenimCo',
    sizes: ['S', 'M', 'L'],
    colors: ['Light Blue'],
    countInStock: 22,
    images: [{ url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_9' }]
  },
  {
    title: 'Silk Satin Collared Blouse',
    description: 'Silky smooth drape with French cuffs and mother-of-pearl buttons. Effortless day-to-night styling.',
    price: 65.00,
    category: 'Women',
    brand: 'Elegance',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White'],
    countInStock: 17,
    images: [{ url: 'https://images.unsplash.com/photo-1603570222045-927513106584?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_10' }]
  },

  // Kids
  {
    title: 'Cartoon Print Cotton Tee',
    description: 'Fun, soft 100% hypoallergenic cotton tee for energetic youngsters.',
    price: 15.99,
    category: 'Kids',
    brand: 'JuniorStyle',
    sizes: ['S', 'M', 'L'],
    colors: ['Yellow'],
    countInStock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_11' }]
  },
  {
    title: 'Cute Denim Overalls',
    description: 'Classic durable denim dungarees with adjustable shoulder straps and side button fastenings.',
    price: 34.99,
    category: 'Kids',
    brand: 'JuniorStyle',
    sizes: ['S', 'M', 'L'],
    colors: ['Blue'],
    countInStock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1519238263530-99abad672f66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_12' }]
  },
  {
    title: 'Cozy Winter Puffer Jacket',
    description: 'Insulated windproof puffer coat with zip chin guard and soft fleece hood.',
    price: 45.00,
    category: 'Kids',
    brand: 'JuniorStyle',
    sizes: ['M', 'L', 'XL'],
    colors: ['Red'],
    countInStock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_13' }]
  },

  // Accessories
  {
    title: 'Handcrafted Full-Grain Leather Belt',
    description: 'Vegetable-tanned saddle leather featuring an antiqued brass roller buckle.',
    price: 35.00,
    category: 'Accessories',
    brand: 'ArtisanCraft',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Brown'],
    countInStock: 35,
    images: [{ url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_14' }]
  },
  {
    title: 'Polarized Aviator Sunglasses',
    description: 'Lightweight gold-tone wireframe with UV400 scratch-resistant polarized lenses.',
    price: 125.00,
    category: 'Accessories',
    brand: 'SunOptics',
    sizes: ['M'],
    colors: ['Gold'],
    countInStock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_15' }]
  },
  {
    title: 'Minimalist Stainless Steel Watch',
    description: 'Slim Japanese quartz movement with sunray dial and quick-release mesh strap.',
    price: 199.99,
    category: 'Accessories',
    brand: 'Chronos',
    sizes: ['M'],
    colors: ['Silver'],
    countInStock: 12,
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_16' }]
  },

  // Footwear
  {
    title: 'AeroGlide Running Shoes',
    description: 'Engineered mesh upper with responsive foam midsole cushioning for athletic energy return.',
    price: 120.00,
    category: 'Footwear',
    brand: 'AeroSport',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black'],
    countInStock: 22,
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_17' }]
  },
  {
    title: 'All-Day Casual White Sneakers',
    description: 'Clean leather minimalist court sneakers with padded collar and textured rubber outsole.',
    price: 85.00,
    category: 'Footwear',
    brand: 'UrbanKicks',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    countInStock: 28,
    images: [{ url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_18' }]
  },
  {
    title: 'Italian Hand-Stitched Loafers',
    description: 'Supple burnished calfskin leather penny loafers with hand-stitched apron toe.',
    price: 145.00,
    category: 'Footwear',
    brand: 'Milanese',
    sizes: ['M', 'L', 'XL'],
    colors: ['Brown'],
    countInStock: 10,
    images: [{ url: 'https://images.unsplash.com/photo-1614252235314-8561cd9ea1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', public_id: 'sample_19' }]
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('Connected to DB for seeding...');

    // Delete existing products if any
    await Product.deleteMany();
    console.log('Cleared existing products.');

    // Insert sample products
    const created = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${created.length} products!`);

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedDB();
