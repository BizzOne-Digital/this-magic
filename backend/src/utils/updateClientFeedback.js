import '../config/env.js';
import connectDB from '../config/db.js';
import Content from '../models/Content.js';
import Service from '../models/Service.js';
import { contentUpdates, serviceUpdates } from '../data/clientContentUpdates.js';

const updateClientFeedback = async () => {
  try {
    await connectDB();

    let content = await Content.findOne();
    if (!content) {
      console.log('No content document found. Run npm run seed first.');
      process.exit(1);
    }

    content.hero.primaryCta = 'Call or Text DJ Adam Today';
    content.hero.secondaryCta = '732 829 2344';
    content.hero.headlineParts = content.hero.headlineParts || {};
    content.hero.headlineParts.scriptLine = 'your event needs';

    if (contentUpdates.aboutParagraphs) {
      content.about.paragraphs = contentUpdates.aboutParagraphs;
    }

    Object.assign(content.aboutPage, contentUpdates.aboutPage);
    Object.assign(content.testimonialsPage, contentUpdates.testimonialsPage);
    Object.assign(content.contactPage, contentUpdates.contactPage);
    Object.assign(content.seo, contentUpdates.seo);
    content.reviewLinks = contentUpdates.reviewLinks;

    await content.save();
    console.log('Website content updated');

    for (const patch of serviceUpdates) {
      const update = { description: patch.description };
      if (patch.features) update.features = patch.features;
      await Service.findOneAndUpdate({ slug: patch.slug }, update);
    }
    console.log(`Updated ${serviceUpdates.length} services`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

updateClientFeedback();
