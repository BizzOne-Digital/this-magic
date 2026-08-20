import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = (file, folder = 'this-magic-moment') => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return reject(new Error('Cloudinary is not configured. Check CLOUDINARY_* in backend .env'));
    }

    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    cloudinary.uploader.upload(
      dataUri,
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId.startsWith('seed-')) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
  }
};

export const getOptimizedUrl = (url, width = 800) => {
  if (!url || !url.includes('cloudinary')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
};
