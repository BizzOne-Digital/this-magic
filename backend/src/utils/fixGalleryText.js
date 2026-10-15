import '../config/env.js';
import connectDB from '../config/db.js';
import Gallery from '../models/Gallery.js';
import { GALLERY_TEXT_BY_ID_PREFIX } from '../data/galleryDescriptions.js';

// Gallery items uploaded with machine-generated IDs as titles (SEO audit F06).
// Keyed by the first 8 characters of the stored title. Descriptions come from a
// visual review of each photo; no venue, client or location is inferred.
// title = short visible caption; caption = descriptive text used as image alt.
const GALLERY_TEXT = GALLERY_TEXT_BY_ID_PREFIX;

const ID_LIKE = /^[0-9a-f]{8}([-\s_]?[0-9a-f]{4}){3}[-\s_]?[0-9a-f]{12}$|^(?=.*\d)[0-9a-f\s_-]{16,}$/i;

const fixGalleryText = async () => {
  try {
    await connectDB();

    const items = await Gallery.find({});
    let updated = 0;
    const unmatched = [];

    for (const item of items) {
      if (!ID_LIKE.test(item.title.trim())) continue;
      const text = GALLERY_TEXT[item.title.trim().slice(0, 8).toLowerCase()];
      if (!text) {
        unmatched.push(item.title);
        continue;
      }
      item.title = text.caption;
      item.caption = text.alt;
      await item.save();
      updated += 1;
      console.log(`Updated ${item._id}: ${text.caption}`);
    }

    console.log(`Updated ${updated} gallery item(s).`);
    if (unmatched.length) {
      console.log('Still using ID titles (edit these in Admin > Gallery):');
      unmatched.forEach((title) => console.log(`  - ${title}`));
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

fixGalleryText();
