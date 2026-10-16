const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(async () => {
  try {
    // Seed default admin account if not already present
    const adminExists = await User.findOne({ email: 'admin@fashionstore.lk' });
    if (!adminExists) {
      await User.create({
        name: 'Store Administrator',
        email: 'admin@fashionstore.lk',
        password: 'admin123',
        role: 'admin',
        phone: '0771234567',
        address: {
          street: '100 Galle Road',
          city: 'Colombo',
          postalCode: '00300'
        }
      });
      console.log('Default Admin Account created: admin@fashionstore.lk / admin123');
    }
  } catch (err) {
    console.warn('Admin check note:', err.message);
  }
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route files
const path = require('path');
const auth = require('./src/routes/authRoutes');
const products = require('./src/routes/productRoutes');
const orders = require('./src/routes/orderRoutes');
const admin = require('./src/routes/adminRoutes');
const upload = require('./src/routes/uploadRoutes');

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/admin', admin);
app.use('/api/upload', upload);

app.get('/', (req, res) => {
  res.send('Fashion Store API is running smoothly...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
