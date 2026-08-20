import { useEffect, useState } from 'react';
import { FiSave, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { contentAPI } from '../../services/api';
import { buildFormData } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import ImageUpload from '../components/ImageUpload';

const Content = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [activeTab, setActiveTab] = useState('hero');
  const [heroImage, setHeroImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);

  useEffect(() => {
    contentAPI
      .get()
      .then((res) => setContent(res.data.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load content'))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (section, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateNestedField = (section, nested, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nested]: { ...prev[section]?.[nested], [field]: value },
      },
    }));
  };

  const updateSeoField = (field, value) => {
    setContent((prev) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await contentAPI.update(content);
      setContent(res.data.data);
      toast.success('Content saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpload = async (file) => {
    setUploading('hero');
    try {
      const formData = buildFormData({ image: file });
      const res = await contentAPI.uploadHero(formData);
      setContent(res.data.data);
      setHeroImage(null);
      toast.success('Hero image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload hero image');
    } finally {
      setUploading('');
    }
  };

  const handleHeroRemove = async () => {
    setUploading('hero');
    try {
      const res = await contentAPI.removeHero();
      setContent(res.data.data);
      setHeroImage(null);
      toast.success('Hero image removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove hero image');
    } finally {
      setUploading('');
    }
  };

  const handleLogoUpload = async (file) => {
    setUploading('logo');
    try {
      const formData = buildFormData({ image: file });
      const res = await contentAPI.uploadLogo(formData);
      setContent(res.data.data);
      setLogoImage(null);
      toast.success('Logo uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload logo');
    } finally {
      setUploading('');
    }
  };

  const handleLogoRemove = async () => {
    setUploading('logo');
    try {
      const res = await contentAPI.removeLogo();
      setContent(res.data.data);
      setLogoImage(null);
      toast.success('Logo removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove logo');
    } finally {
      setUploading('');
    }
  };

  const handleAboutUpload = async (file) => {
    setUploading('about');
    try {
      const formData = buildFormData({ image: file });
      const res = await contentAPI.uploadAbout(formData);
      setContent(res.data.data);
      toast.success('About image added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload about image');
    } finally {
      setUploading('');
    }
  };

  const handleAboutRemove = async (index) => {
    try {
      const res = await contentAPI.removeAboutImage(index);
      setContent(res.data.data);
      toast.success('About image removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove about image');
    }
  };

  const handleClearAboutImages = async () => {
    try {
      const res = await contentAPI.clearAboutImages();
      setContent(res.data.data);
      toast.success('Homepage collage reset to default images');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear collage images');
    }
  };

  const handleAboutPageHeroUpload = async (file) => {
    setUploading('aboutPageHero');
    try {
      const formData = buildFormData({ image: file });
      const res = await contentAPI.uploadAboutPageHero(formData);
      setContent(res.data.data);
      toast.success('About page hero image updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload about page hero');
    } finally {
      setUploading('');
    }
  };

  const handleAboutPageHeroRemove = async () => {
    try {
      const res = await contentAPI.removeAboutPageHero();
      setContent(res.data.data);
      toast.success('About page hero image removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove about page hero');
    }
  };

  const handleAboutPageStoryUpload = async (file) => {
    setUploading('aboutPageStory');
    try {
      const formData = buildFormData({ image: file });
      const res = await contentAPI.uploadAboutPageStory(formData);
      setContent(res.data.data);
      toast.success('About page story image updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload about page story image');
    } finally {
      setUploading('');
    }
  };

  const handleAboutPageStoryRemove = async () => {
    try {
      const res = await contentAPI.removeAboutPageStory();
      setContent(res.data.data);
      toast.success('About page story image removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove about page story image');
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'social', label: 'Social' },
    { id: 'footer', label: 'Footer' },
    { id: 'seo', label: 'SEO' },
    { id: 'logo', label: 'Logo' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Website Content</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your website copy and media</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark disabled:opacity-50 self-start"
        >
          {saving ? <LoadingSpinner size="sm" /> : <FiSave className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === id ? 'bg-teal text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {activeTab === 'hero' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-navy">Hero Section</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Headline</label>
              <input
                value={content.hero?.headline || ''}
                onChange={(e) => updateField('hero', 'headline', e.target.value)}
                className="admin-input"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Line 1</label>
                <input value={content.hero?.headlineParts?.line1 || ''} onChange={(e) => updateNestedField('hero', 'headlineParts', 'line1', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Line 2</label>
                <input value={content.hero?.headlineParts?.line2 || ''} onChange={(e) => updateNestedField('hero', 'headlineParts', 'line2', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Line 3</label>
                <input value={content.hero?.headlineParts?.line3 || ''} onChange={(e) => updateNestedField('hero', 'headlineParts', 'line3', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Script Line</label>
                <input value={content.hero?.headlineParts?.scriptLine || ''} onChange={(e) => updateNestedField('hero', 'headlineParts', 'scriptLine', e.target.value)} className="admin-input" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subheading</label>
              <input value={content.hero?.subheading || ''} onChange={(e) => updateField('hero', 'subheading', e.target.value)} className="admin-input" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary CTA</label>
                <input value={content.hero?.primaryCta || ''} onChange={(e) => updateField('hero', 'primaryCta', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Secondary CTA</label>
                <input value={content.hero?.secondaryCta || ''} onChange={(e) => updateField('hero', 'secondaryCta', e.target.value)} className="admin-input" />
              </div>
            </div>
            <div>
              <ImageUpload
                label="Hero Image"
                preview={heroImage ? URL.createObjectURL(heroImage) : content.hero?.imageUrl}
                uploading={uploading === 'hero'}
                onChange={(file) => {
                  setHeroImage(file);
                  handleHeroUpload(file);
                }}
                onRemove={handleHeroRemove}
              />
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-navy">About Section</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Headline</label>
                <input value={content.about?.headline || ''} onChange={(e) => updateField('about', 'headline', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Script Accent</label>
                <input value={content.about?.scriptAccent || ''} onChange={(e) => updateField('about', 'scriptAccent', e.target.value)} className="admin-input" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Paragraphs (one per line)</label>
              <textarea
                value={(content.about?.paragraphs || []).join('\n')}
                onChange={(e) => updateField('about', 'paragraphs', e.target.value.split('\n').filter(Boolean))}
                rows={6}
                className="admin-input resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">CTA Label</label>
              <input value={content.about?.ctaLabel || ''} onChange={(e) => updateField('about', 'ctaLabel', e.target.value)} className="admin-input" />
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-6">
              <div>
                <h3 className="font-medium text-navy mb-1">About Page Images</h3>
                <p className="text-xs text-gray-500 mb-4">These change the separate /about page only — not the homepage collage.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUpload
                    label="About Page — Top Banner"
                    preview={content.aboutPage?.heroImageUrl}
                    uploading={uploading === 'aboutPageHero'}
                    onChange={handleAboutPageHeroUpload}
                    onRemove={handleAboutPageHeroRemove}
                  />
                  <ImageUpload
                    label="About Page — Story Section"
                    preview={content.aboutPage?.storyImageUrl}
                    uploading={uploading === 'aboutPageStory'}
                    onChange={handleAboutPageStoryUpload}
                    onRemove={handleAboutPageStoryRemove}
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-medium text-navy">Homepage About Collage</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      4-photo grid on homepage only. Upload all 4 to replace defaults.
                    </p>
                  </div>
                  {(content.about?.imageUrls || []).filter((u) => u?.includes('cloudinary.com')).length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAboutImages}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Reset to Defaults
                    </button>
                  )}
                </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {(content.about?.imageUrls || [])
                  .map((url, index) => ({ url, index }))
                  .filter(({ url }) => url?.includes('cloudinary.com'))
                  .map(({ url, index }) => (
                    <div key={`${url}-${index}`} className="relative group">
                      <img src={url} alt={`About ${index + 1}`} className="w-full h-24 object-cover rounded-lg border" />
                      <button
                        type="button"
                        onClick={() => handleAboutRemove(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>

              <ImageUpload
                label="Add Collage Photo (upload 4 total)"
                preview=""
                uploading={uploading === 'about'}
                onChange={handleAboutUpload}
              />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-navy">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input value={content.contact?.email || ''} onChange={(e) => updateField('contact', 'email', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input value={content.contact?.phone || ''} onChange={(e) => updateField('contact', 'phone', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                <input value={content.contact?.website || ''} onChange={(e) => updateField('contact', 'website', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                <input value={content.contact?.address || ''} onChange={(e) => updateField('contact', 'address', e.target.value)} className="admin-input" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Area</label>
                <input value={content.contact?.serviceArea || ''} onChange={(e) => updateField('contact', 'serviceArea', e.target.value)} className="admin-input" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-navy">Social Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram Handle</label>
                <input value={content.social?.instagram || ''} onChange={(e) => updateField('social', 'instagram', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram URL</label>
                <input value={content.social?.instagramUrl || ''} onChange={(e) => updateField('social', 'instagramUrl', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook Name</label>
                <input value={content.social?.facebook || ''} onChange={(e) => updateField('social', 'facebook', e.target.value)} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook URL</label>
                <input value={content.social?.facebookUrl || ''} onChange={(e) => updateField('social', 'facebookUrl', e.target.value)} className="admin-input" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-navy">Footer</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tagline</label>
              <input value={content.footer?.tagline || ''} onChange={(e) => updateField('footer', 'tagline', e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Copyright</label>
              <input value={content.footer?.copyright || ''} onChange={(e) => updateField('footer', 'copyright', e.target.value)} className="admin-input" />
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-navy">SEO Settings</h2>
            {[
              { prefix: 'home', label: 'Home Page' },
              { prefix: 'about', label: 'About Page' },
              { prefix: 'testimonials', label: 'Testimonials Page' },
              { prefix: 'contact', label: 'Contact Page' },
            ].map(({ prefix, label }) => (
              <div key={prefix} className="border border-gray-100 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-navy">{label}</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                  <input
                    value={content.seo?.[`${prefix}Title`] || ''}
                    onChange={(e) => updateSeoField(`${prefix}Title`, e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    value={content.seo?.[`${prefix}Description`] || ''}
                    onChange={(e) => updateSeoField(`${prefix}Description`, e.target.value)}
                    rows={2}
                    className="admin-input resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'logo' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-navy">Logo</h2>
            <ImageUpload
              label="Site Logo"
              preview={logoImage ? URL.createObjectURL(logoImage) : content.logo?.imageUrl}
              uploading={uploading === 'logo'}
              onChange={(file) => {
                setLogoImage(file);
                handleLogoUpload(file);
              }}
              onRemove={handleLogoRemove}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
