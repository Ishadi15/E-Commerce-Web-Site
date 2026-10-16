const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    let ext = path.extname(file.originalname).toLowerCase();
    if (!ext || ext === '.') {
      const mimeSub = file.mimetype ? file.mimetype.split('/')[1] : 'jpg';
      ext = `.${mimeSub === 'jpeg' ? 'jpg' : mimeSub}`;
    }
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

// File filter (Only Images - supports all common image formats including JFIF, AVIF, WEBP)
function fileFilter(req, file, cb) {
  const allowedExts = /\.(jpe?g|png|webp|gif|svg|bmp|tiff|avif|jfif)$/i;
  const isImageMime = file.mimetype && (file.mimetype.startsWith('image/') || file.mimetype === 'application/octet-stream');
  const isImageExt = allowedExts.test(file.originalname);

  if (isImageMime || isImageExt) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPG, PNG, WEBP, GIF, SVG, AVIF, JFIF) are allowed!'));
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

// @route   POST /api/upload
// @desc    Upload product image file
// @access  Public or Protected
router.post('/', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image file to upload'
      });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fullUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: fullUrl,
      filename: req.file.filename
    });
  });
});

module.exports = router;
