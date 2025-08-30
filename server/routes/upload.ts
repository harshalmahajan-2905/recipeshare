import { RequestHandler } from 'express';
import multer from 'multer';
import { upload, cloudinaryHelpers, testCloudinaryConnection } from '../config/cloudinary';
import { authenticateToken } from './auth';

// Upload single image
export const uploadImage: RequestHandler = async (req, res) => {
  try {
    // Check if Cloudinary is configured
    if (!cloudinaryHelpers.validateConfig()) {
      return res.status(500).json({ 
        error: 'Image upload service not configured. Please contact administrator.' 
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const file = req.file as any; // Cloudinary extends the file object

    // Return image information
    res.json({
      message: 'Image uploaded successfully',
      image: {
        url: file.path,
        publicId: file.filename,
        width: file.width,
        height: file.height,
        format: file.format,
        bytes: file.bytes,
        // Generate different sizes
        thumbnail: cloudinaryHelpers.getThumbnailUrl(file.filename),
        optimized: cloudinaryHelpers.getOptimizedUrl(file.filename)
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image. Please try again.' 
    });
  }
};

// Upload image from URL (for importing external images)
export const uploadImageFromUrl: RequestHandler = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Validate URL format
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i;
    if (!urlPattern.test(imageUrl)) {
      return res.status(400).json({ error: 'Invalid image URL format' });
    }

    // Check if Cloudinary is configured
    if (!cloudinaryHelpers.validateConfig()) {
      return res.status(500).json({ 
        error: 'Image upload service not configured. Please contact administrator.' 
      });
    }

    // Upload to Cloudinary
    const result = await cloudinaryHelpers.uploadFromUrl(imageUrl);

    res.json({
      message: 'Image uploaded successfully from URL',
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        thumbnail: cloudinaryHelpers.getThumbnailUrl(result.public_id),
        optimized: cloudinaryHelpers.getOptimizedUrl(result.public_id)
      }
    });
  } catch (error) {
    console.error('Image upload from URL error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image from URL. Please check the URL and try again.' 
    });
  }
};

// Delete image
export const deleteImage: RequestHandler = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: 'Image public ID is required' });
    }

    // Check if Cloudinary is configured
    if (!cloudinaryHelpers.validateConfig()) {
      return res.status(500).json({ 
        error: 'Image service not configured. Please contact administrator.' 
      });
    }

    // Delete from Cloudinary
    const result = await cloudinaryHelpers.deleteImage(publicId);

    if (result.result === 'ok') {
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found or already deleted' });
    }
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ 
      error: 'Failed to delete image. Please try again.' 
    });
  }
};

// Get image info
export const getImageInfo: RequestHandler = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ error: 'Image public ID is required' });
    }

    // Generate URLs for different sizes
    const imageInfo = {
      publicId,
      original: cloudinaryHelpers.getOptimizedUrl(publicId),
      thumbnail: cloudinaryHelpers.getThumbnailUrl(publicId),
      medium: cloudinaryHelpers.getOptimizedUrl(publicId, { width: 500, height: 375 }),
      large: cloudinaryHelpers.getOptimizedUrl(publicId, { width: 1200, height: 900 })
    };

    res.json(imageInfo);
  } catch (error) {
    console.error('Get image info error:', error);
    res.status(500).json({ 
      error: 'Failed to get image information.' 
    });
  }
};

// Middleware for handling multer errors
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB.' 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files. Only one image allowed.' 
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Unexpected file field.' 
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ 
      error: 'Only image files (JPG, PNG, WebP) are allowed.' 
    });
  }

  return res.status(500).json({ 
    error: 'File upload failed. Please try again.' 
  });
};

// Create the upload middleware chain
export const uploadImageMiddleware = [
  authenticateToken,
  upload.single('image'),
  handleUploadError,
  uploadImage
];
