import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage configuration for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'recipeshare', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'fill', quality: 'auto' }, // Main image
      { width: 400, height: 300, crop: 'fill', quality: 'auto', fetch_format: 'auto' } // Thumbnail
    ],
  } as any,
});

// Multer configuration
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Helper functions for Cloudinary operations
export const cloudinaryHelpers = {
  // Upload image from URL (for external images)
  uploadFromUrl: async (imageUrl: string, folder: string = 'recipeshare'): Promise<any> => {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: folder,
        transformation: [
          { width: 800, height: 600, crop: 'fill', quality: 'auto' }
        ]
      });
      return result;
    } catch (error) {
      console.error('Error uploading image from URL:', error);
      throw error;
    }
  },

  // Delete image by public_id
  deleteImage: async (publicId: string): Promise<any> => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Generate optimized image URL
  getOptimizedUrl: (publicId: string, options: any = {}): string => {
    const defaultOptions = {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    };
    
    return cloudinary.url(publicId, { ...defaultOptions, ...options });
  },

  // Generate thumbnail URL
  getThumbnailUrl: (publicId: string): string => {
    return cloudinary.url(publicId, {
      width: 300,
      height: 200,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    });
  },

  // Validate Cloudinary configuration
  validateConfig: (): boolean => {
    const { cloud_name, api_key, api_secret } = cloudinary.config();
    return !!(cloud_name && api_key && api_secret);
  }
};

// Test Cloudinary connection
export const testCloudinaryConnection = async (): Promise<boolean> => {
  try {
    if (!cloudinaryHelpers.validateConfig()) {
      console.warn('⚠️  Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET');
      return false;
    }

    // Test by getting account details
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error);
    return false;
  }
};

export { cloudinary };
