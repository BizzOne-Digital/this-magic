import { getGalleryText } from '../constants/gallery.js';

export const normalizePublicData = (key, value, previous = {}) => {
  if (key === 'gallery') return value.map((item) => {
    const text = getGalleryText(item);
    return { ...item, title: text.caption, caption: text.alt };
  });
  if (key === 'testimonials') return value.map((item) => {
    const known = previous.testimonials?.find((review) => review.review === item.review);
    return { ...item, sourceLabel: item.sourceLabel || known?.sourceLabel || '' };
  });
  return value;
};
