import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { servicesAPI } from '../../services/api';
import { buildFormData } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import ConfirmModal from '../components/ConfirmModal';
import ImageUpload from '../components/ImageUpload';

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  shortDescription: '',
  icon: 'music',
  ctaLabel: 'Learn More',
  ctaLink: '/contact',
  features: '',
  order: 0,
  isActive: true,
  image: null,
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await servicesAPI.getAll(true);
      setServices(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const generateSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreview('');
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setEditing(service);
    setForm({
      title: service.title,
      slug: service.slug,
      description: service.description,
      shortDescription: service.shortDescription,
      icon: service.icon || 'music',
      ctaLabel: service.ctaLabel || 'Learn More',
      ctaLink: service.ctaLink || '/contact',
      features: service.features?.join('\n') || '',
      order: service.order || 0,
      isActive: service.isActive,
      image: null,
    });
    setPreview(service.imageUrl || '');
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.slug.trim()) newErrors.slug = 'Slug is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!editing && !form.image && !preview) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features.split('\n').filter(Boolean),
        order: Number(form.order),
      };
      const formData = buildFormData(payload);
      if (editing) {
        await servicesAPI.update(editing._id, formData);
        toast.success('Service updated');
      } else {
        await servicesAPI.create(formData);
        toast.success('Service created');
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (service) => {
    try {
      const formData = buildFormData({ isActive: !service.isActive });
      await servicesAPI.update(service._id, formData);
      toast.success(`Service ${service.isActive ? 'deactivated' : 'activated'}`);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await servicesAPI.delete(deleteTarget._id);
      toast.success('Service deleted');
      setDeleteTarget(null);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

  const handleImageChange = (file) => {
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const columns = [
    {
      key: 'title',
      label: 'Service',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.imageUrl && (
            <img src={row.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
          )}
          <span className="font-medium">{row.title}</span>
        </div>
      ),
    },
    { key: 'slug', label: 'Slug' },
    {
      key: 'isActive',
      label: 'Status',
      render: (row) => (
        <button
          type="button"
          onClick={() => toggleActive(row)}
          className={`status-badge cursor-pointer ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </button>
      ),
    },
    { key: 'order', label: 'Order' },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={() => openEdit(row)} className="p-1.5 text-teal hover:bg-teal/10 rounded-lg">
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setDeleteTarget(row)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Services</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your service offerings</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors self-start"
        >
          <FiPlus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
      ) : (
        <DataTable columns={columns} data={services} emptyMessage="No services yet." />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-navy">{editing ? 'Edit Service' : 'Add Service'}</h3>
              <button type="button" onClick={() => setModalOpen(false)}><FiX className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setForm({ ...form, title, slug: editing ? form.slug : generateSlug(title) });
                    }}
                    className={`admin-input ${errors.title ? 'border-red-500' : ''}`}
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug *</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className={`admin-input ${errors.slug ? 'border-red-500' : ''}`}
                  />
                  {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description *</label>
                <input
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className={`admin-input ${errors.shortDescription ? 'border-red-500' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className={`admin-input resize-none ${errors.description ? 'border-red-500' : ''}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Features (one per line)</label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  rows={3}
                  className="admin-input resize-none"
                  placeholder="Professional sound system&#10;Wireless microphones&#10;Custom playlists"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">CTA Label</label>
                  <input value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">CTA Link</label>
                  <input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="admin-input" />
                </div>
              </div>

              <ImageUpload
                label="Service Image"
                preview={preview}
                onChange={handleImageChange}
                onClear={() => { setForm({ ...form, image: null }); setPreview(editing?.imageUrl || ''); }}
                required={!editing}
              />
              {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-teal focus:ring-teal"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark disabled:opacity-50">
                {saving ? <LoadingSpinner size="sm" /> : <FiSave className="w-4 h-4" />}
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
};

export default Services;
