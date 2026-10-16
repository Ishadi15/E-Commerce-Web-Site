const Product = require('../models/Product');

// @desc    Get all products with filtering, search, sorting, and pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { keyword, category, color, size, brand, inStock, maxPrice, sort, page, limit } = req.query;

    const query = {};

    // Search by keyword in title, description, brand, or category with smart synonyms
    if (keyword && keyword.trim() !== '') {
      const kw = keyword.trim();
      const lower = kw.toLowerCase();
      const orConditions = [
        { title: { $regex: kw, $options: 'i' } },
        { description: { $regex: kw, $options: 'i' } },
        { brand: { $regex: kw, $options: 'i' } },
        { category: { $regex: kw, $options: 'i' } }
      ];

      if (/gent|men|boy|male/i.test(lower)) {
        orConditions.push({ category: 'Men' });
      }
      if (/ladi|lady|women|woman|girl|female/i.test(lower)) {
        orConditions.push({ category: 'Women' });
      }
      if (/kid|baby|child/i.test(lower)) {
        orConditions.push({ category: 'Kids' });
      }
      if (/shoe|sneaker|loafer|footwear|kicks/i.test(lower)) {
        orConditions.push({ category: 'Footwear' });
      }
      if (/watch|belt|sunglass|accessor/i.test(lower)) {
        orConditions.push({ category: 'Accessories' });
      }

      query.$or = orConditions;
    }

    // Category filter
    if (category && category !== '' && category !== 'All') {
      query.category = category;
    }

    // Color filter
    if (color && color !== '' && color !== 'All') {
      query.colors = { $in: [new RegExp(`^${color}$`, 'i')] };
    }

    // Size filter
    if (size && size !== '' && size !== 'All') {
      query.sizes = { $in: [size] };
    }

    // Brand filter
    if (brand && brand !== '' && brand !== 'All') {
      query.brand = { $regex: brand.trim(), $options: 'i' };
    }

    // Stock availability filter
    if (inStock === 'true') {
      query.countInStock = { $gt: 0 };
    }

    // Max Price filter
    if (maxPrice && !isNaN(Number(maxPrice))) {
      query.price = { $lte: Number(maxPrice) };
    }

    // Sorting options
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    } else if (sort === 'popular') {
      sortOption = { countInStock: -1 };
    }

    const totalCount = await Product.countDocuments(query);

    let queryExec = Product.find(query).sort(sortOption);

    // Optional pagination
    if (limit && !isNaN(Number(limit))) {
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit);
      queryExec = queryExec.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const products = await queryExec;

    res.status(200).json({
      success: true,
      totalCount,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving product',
      error: error.message
    });
  }
};

// @desc    Get related products by category
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    }).limit(4);

    res.status(200).json({
      success: true,
      count: related.length,
      data: related
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch related products',
      error: error.message
    });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new review for product
// @route   POST /api/products/:id/reviews
// @access  Public / Optional Auth
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment, name } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rating between 1 and 5'
      });
    }

    if (!comment || comment.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a review comment'
      });
    }

    const reviewerName = req.user?.name || name || 'Customer';
    const userId = req.user?._id || null;

    // Check if user already reviewed
    if (userId) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user && r.user.toString() === userId.toString()
      );

      if (alreadyReviewed) {
        alreadyReviewed.rating = ratingNum;
        alreadyReviewed.comment = comment.trim();
        alreadyReviewed.createdAt = Date.now();
      } else {
        product.reviews.push({
          user: userId,
          name: reviewerName,
          rating: ratingNum,
          comment: comment.trim(),
          createdAt: Date.now()
        });
      }
    } else {
      product.reviews.push({
        name: reviewerName,
        rating: ratingNum,
        comment: comment.trim(),
        createdAt: Date.now()
      });
    }

    product.numReviews = product.reviews.length;
    const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = Number((totalRating / product.reviews.length).toFixed(1));

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

