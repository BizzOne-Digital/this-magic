import Content from '../models/Content.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';

export const getContent = async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = await Content.create({});
    }
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) content = await Content.create({});

    const updated = await Content.findByIdAndUpdate(content._id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadHeroImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    let content = await Content.findOne();
    if (!content) content = await Content.create({});

    if (content.hero?.publicId) await deleteFromCloudinary(content.hero.publicId);
    const result = await uploadToCloudinary(req.file, 'this-magic-moment/hero');

    content.hero.imageUrl = result.secure_url;
    content.hero.publicId = result.public_id;
    await content.save();

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    let content = await Content.findOne();
    if (!content) content = await Content.create({});

    if (content.logo?.publicId) await deleteFromCloudinary(content.logo.publicId);
    const result = await uploadToCloudinary(req.file, 'this-magic-moment/logo');

    content.logo.imageUrl = result.secure_url;
    content.logo.publicId = result.public_id;
    await content.save();

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeHeroImage = async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) content = await Content.create({});

    if (content.hero?.publicId) await deleteFromCloudinary(content.hero.publicId);
    content.hero.imageUrl = '';
    content.hero.publicId = '';
    await content.save();

    res.json({ success: true, data: content, message: 'Hero image removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeLogo = async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) content = await Content.create({});

    if (content.logo?.publicId) await deleteFromCloudinary(content.logo.publicId);
    content.logo.imageUrl = '';
    content.logo.publicId = '';
    await content.save();

    res.json({ success: true, data: content, message: 'Logo removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadAboutImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    let content = await Content.findOne();
    if (!content) content = await Content.create({});

    const result = await uploadToCloudinary(req.file, 'this-magic-moment/about');
    if (!content.about.imageUrls) content.about.imageUrls = [];
    if (!content.about.imagePublicIds) content.about.imagePublicIds = [];
    content.about.imageUrls.push(result.secure_url);
    content.about.imagePublicIds.push(result.public_id);
    await content.save();

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeAboutImage = async (req, res) => {
  try {
    const index = parseInt(req.params.index, 10);
    let content = await Content.findOne();
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });

    const publicId = content.about?.imagePublicIds?.[index];
    if (publicId) await deleteFromCloudinary(publicId);

    content.about.imageUrls.splice(index, 1);
    content.about.imagePublicIds.splice(index, 1);
    await content.save();

    res.json({ success: true, data: content, message: 'About image removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearAboutImages = async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) content = await Content.create({});

    for (const publicId of content.about?.imagePublicIds || []) {
      if (publicId) await deleteFromCloudinary(publicId);
    }
    content.about.imageUrls = [];
    content.about.imagePublicIds = [];
    await content.save();

    res.json({ success: true, data: content, message: 'Homepage collage images cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadAboutPageHero = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    let content = await Content.findOne();
    if (!content) content = await Content.create({});

    if (content.aboutPage?.heroPublicId) await deleteFromCloudinary(content.aboutPage.heroPublicId);
    const result = await uploadToCloudinary(req.file, 'this-magic-moment/about-page');

    content.aboutPage.heroImageUrl = result.secure_url;
    content.aboutPage.heroPublicId = result.public_id;
    await content.save();

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadAboutPageStory = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    let content = await Content.findOne();
    if (!content) content = await Content.create({});

    if (content.aboutPage?.storyPublicId) await deleteFromCloudinary(content.aboutPage.storyPublicId);
    const result = await uploadToCloudinary(req.file, 'this-magic-moment/about-page');

    content.aboutPage.storyImageUrl = result.secure_url;
    content.aboutPage.storyPublicId = result.public_id;
    await content.save();

    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeAboutPageHero = async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    if (content.aboutPage?.heroPublicId) await deleteFromCloudinary(content.aboutPage.heroPublicId);
    content.aboutPage.heroImageUrl = '';
    content.aboutPage.heroPublicId = '';
    await content.save();
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeAboutPageStory = async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    if (content.aboutPage?.storyPublicId) await deleteFromCloudinary(content.aboutPage.storyPublicId);
    content.aboutPage.storyImageUrl = '';
    content.aboutPage.storyPublicId = '';
    await content.save();
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
