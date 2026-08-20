import { useEffect, useState, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiChevronUp, FiChevronDown, FiUpload, FiLayers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { galleryAPI } from '../../services/api';
import { buildFormData, buildBulkGalleryFormData, fileNameToTitle, GALLERY_CATEGORIES } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import ImageUpload from '../components/ImageUpload';

const emptyForm = {
  title: '',
  caption: '',
  category: 'General',
  order: 0,
  isActive: true,
  image: null,
};

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [errors, setErrors] = useState({});
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkItems, setBulkItems] = useState([]);
  const [bulkDefaultCategory, setBulkDefaultCategory] = useState('General');
  const [bulkUploading, setBulkUploading] = useState(false);
  const bulkFileRef = useRef(null);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const params = { all: true };
      if (categoryFilter) params.category = categoryFilter;
      const res = await galleryAPI.getAll(params);
      setItems(res.data.data.sort((a, b) => a.order - b.order));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [categoryFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: items.length });
    setPreview('');
    setErrors({});
    setModalOpen(true);
  };

  const openBulkUpload = () => {
    setBulkItems([]);
    setBulkDefaultCategory('General');
    setBulkModalOpen(true);
  };

  const handleBulkFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newItems = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      title: fileNameToTitle(file.name) || file.name,
      category: bulkDefaultCategory,
      caption: '',
    }));

    setBulkItems((prev) => [...prev, ...newItems]);
    if (bulkFileRef.current) bulkFileRef.current.value = '';
  };

  const updateBulkItem = (id, field, value) => {
    setBulkItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeBulkItem = (id) => {
    setBulkItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  const applyBulkCategoryToAll = () => {
    setBulkItems((prev) => prev.map((item) => ({ ...item, category: bulkDefaultCategory })));
    toast.success('Category applied to all images');
  };

  const closeBulkModal = () => {
    bulkItems.forEach((item) => {
      if (item.preview) URL.revokeObjectURL(item.preview);
    });
    setBulkItems([]);
    setBulkModalOpen(false);
  };

  const handleBulkUpload = async () => {
    if (!bulkItems.length) {
      toast.error('Select at least one image');
      return;
    }

    const invalid = bulkItems.find((item) => !item.title.trim());
    if (invalid) {
      toast.error('Every image needs a title');
      return;
    }

    setBulkUploading(true);
    try {
      const formData = buildBulkGalleryFormData(
        bulkItems.map((item) => item.file),
        bulkItems.map(({ title, category, caption }) => ({ title, category, caption })),
        bulkDefaultCategory,
        items.length
      );

      const res = await galleryAPI.bulkCreate(formData);
      toast.success(res.data.message || 'Images uploaded');
      if (res.data.errors?.length) {
        res.data.errors.forEach((err) => toast.error(`${err.file}: ${err.message}`));
      }
      closeBulkModal();
      fetchGallery();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk upload failed');
    } finally {
      setBulkUploading(false);
    }
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      caption: item.caption || '',
      category: item.category,
      order: item.order || 0,
      isActive: item.isActive,
      image: null,
    });
    setPreview(item.imageUrl || '');
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!editing && !form.image && !preview) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      const formData = buildFormData(payload);
      if (editing) {
        await galleryAPI.update(editing._id, formData);
        toast.success('Gallery item updated');
      } else {
        await galleryAPI.create(formData);
        toast.success('Gallery item added');
      }
      setModalOpen(false);
      fetchGallery();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await galleryAPI.delete(deleteTarget._id);
      toast.success('Gallery item deleted');
      setDeleteTarget(null);
      fetchGallery();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const moveItem = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    const updated = reordered.map((item, i) => ({ ...item, order: i }));
    setItems(updated);

    setReordering(true);
    try {
      await galleryAPI.reorder(updated.map(({ _id, order }) => ({ id: _id, order })));
      toast.success('Order updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reorder');
      fetchGallery();
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">Manage event photos and media</p>
        </div>
        <div className="flex flex-wrap gap-2 self-start">
          <button
            type="button"
            onClick={openBulkUpload}
            className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-light"
          >
            <FiLayers className="w-4 h-4" /> Bulk Upload
          </button>
          <button type="button" onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark">
            <FiPlus className="w-4 h-4" /> Add Image
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="admin-input w-auto min-w-[160px]"
        >
          <option value="">All Categories</option>
          {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
      ) : items.length === 0 ? (
        <div className="admin-card text-center py-12 text-gray-500">No gallery items yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <div key={item._id} className="admin-card p-0 overflow-hidden group">
              <div className="relative aspect-square">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button type="button" onClick={() => openEdit(item)} className="p-2 bg-white rounded-lg text-teal hover:bg-teal hover:text-white transition-colors">
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(item)} className="p-2 bg-white rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="font-medium text-sm text-navy truncate">{item.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{item.category}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0 || reordering}
                      className="p-1 text-gray-400 hover:text-teal disabled:opacity-30"
                    >
                      <FiChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1 || reordering}
                      className="p-1 text-gray-400 hover:text-teal disabled:opacity-30"
                    >
                      <FiChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-navy">{editing ? 'Edit Image' : 'Add Image'}</h3>
              <button type="button" onClick={() => setModalOpen(false)}><FiX className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={`admin-input ${errors.title ? 'border-red-500' : ''}`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Caption</label>
                <input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="admin-input">
                  {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <ImageUpload
                label="Image"
                preview={preview}
                onChange={(file) => { setForm({ ...form, image: file }); setPreview(URL.createObjectURL(file)); }}
                onRemove={() => { setForm({ ...form, image: null }); setPreview(editing?.imageUrl || ''); }}
                required={!editing}
              />
              {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-gray-300 text-teal focus:ring-teal" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg disabled:opacity-50">
                {saving ? <LoadingSpinner size="sm" /> : <FiSave className="w-4 h-4" />}
                {editing ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={closeBulkModal} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-lg font-semibold text-navy">Bulk Upload Images</h3>
                <p className="text-sm text-gray-500 mt-0.5">Select multiple photos and set name & category for each</p>
              </div>
              <button type="button" onClick={closeBulkModal}><FiX className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Category</label>
                  <select
                    value={bulkDefaultCategory}
                    onChange={(e) => setBulkDefaultCategory(e.target.value)}
                    className="admin-input"
                  >
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={applyBulkCategoryToAll}
                  disabled={!bulkItems.length}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-teal hover:text-teal disabled:opacity-50"
                >
                  Apply to all
                </button>
                <button
                  type="button"
                  onClick={() => bulkFileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark"
                >
                  <FiUpload className="w-4 h-4" />
                  Select Images
                </button>
                <input
                  ref={bulkFileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleBulkFiles}
                  className="hidden"
                />
              </div>

              {bulkItems.length === 0 ? (
                <button
                  type="button"
                  onClick={() => bulkFileRef.current?.click()}
                  className="w-full py-16 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-teal hover:text-teal transition-colors"
                >
                  <FiUpload className="w-8 h-8 mx-auto mb-2" />
                  Click to select multiple images (up to 30)
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{bulkItems.length} image(s) ready to upload</p>
                  {bulkItems.map((item, index) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl bg-white">
                      <img
                        src={item.preview}
                        alt={item.title}
                        className="w-full sm:w-28 h-28 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
                          <input
                            value={item.title}
                            onChange={(e) => updateBulkItem(item.id, 'title', e.target.value)}
                            className="admin-input"
                            placeholder={`Image ${index + 1}`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                          <select
                            value={item.category}
                            onChange={(e) => updateBulkItem(item.id, 'category', e.target.value)}
                            className="admin-input"
                          >
                            {GALLERY_CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Caption</label>
                          <input
                            value={item.caption}
                            onChange={(e) => updateBulkItem(item.id, 'caption', e.target.value)}
                            className="admin-input"
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBulkItem(item.id)}
                        className="self-start sm:self-center p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Remove"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => bulkFileRef.current?.click()}
                    className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-teal hover:text-teal"
                  >
                    + Add more images
                  </button>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <button type="button" onClick={closeBulkModal} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkUpload}
                disabled={bulkUploading || !bulkItems.length}
                className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg disabled:opacity-50"
              >
                {bulkUploading ? <LoadingSpinner size="sm" /> : <FiUpload className="w-4 h-4" />}
                Upload {bulkItems.length > 0 ? `${bulkItems.length} Images` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Image"
        message={`Delete "${deleteTarget?.title}" from gallery?`}
        loading={deleting}
      />
    </div>
  );
};

export default Gallery;
