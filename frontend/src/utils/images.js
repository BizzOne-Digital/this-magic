import dimensions from '../data/image-dimensions.json';
// Responsive image helpers.
// CMS images live on Cloudinary, which can resize and convert on the fly, so we
// build a srcset by inserting a transformation after "/upload/".
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;

export const cloudinaryUrl = (url, width) => {
  const match = url?.match(CLOUDINARY_UPLOAD);
  if (!match) return url;
  return `${match[1]}f_auto,q_auto,c_limit,w_${width}/${match[2]}`;
};

/**
 * Returns { src, srcSet, sizes } for Cloudinary URLs, or just { src } for anything else.
 * Spread onto an <img>.
 */
export const responsiveImage = (url, widths = [400, 800, 1200], sizes = '100vw') => {
  const intrinsic = dimensions[url] || {};
  if (!url || !CLOUDINARY_UPLOAD.test(url)) {
    if (url === '/images/hero-1672.webp') return {
      src: url, srcSet: '/images/hero-960.webp 960w, /images/hero-1672.webp 1672w', sizes, ...intrinsic,
    };
    const local = url?.match(/^\/images\/(event-\d+)-(400|800)\.webp$/);
    return local ? {
      src: url,
      srcSet: `/images/${local[1]}-400.webp 400w, /images/${local[1]}-800.webp 800w`,
      sizes,
      ...intrinsic,
    } : { src: url, ...intrinsic };
  }
  widths = [...new Set(widths.map((width) => Math.min(width, intrinsic.width || width)))];
  return {
    src: cloudinaryUrl(url, widths[widths.length - 1]),
    srcSet: widths.map((w) => `${cloudinaryUrl(url, w)} ${w}w`).join(', '),
    sizes,
    ...intrinsic,
  };
};

// Local, pre-optimized variants generated from /public1.png (1402 x 1122).
export const DJ_PORTRAIT = {
  src: '/images/dj-adam-portrait-960.webp',
  srcSet:
    '/images/dj-adam-portrait-640.webp 640w, /images/dj-adam-portrait-960.webp 960w, /images/dj-adam-portrait-1402.webp 1402w',
  width: 1402,
  height: 1122,
};
