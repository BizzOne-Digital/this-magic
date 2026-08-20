import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { promotionsAPI } from '../../services/api';
import { buildFormData, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import ConfirmModal from '../components/ConfirmModal';
import ImageUpload from '../components/ImageUpload';

const emptyForm = {
  title: '',
  description: '',
  badge: '',
  icon: 'tag',
  discountAmount: '',
  terms: '',
  expiryDate: '',
  isActive: true,
  isFeatured: false,
  order: 0,
  image: null,
};

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await promotionsAPI.getAll(true);
      setPromotions(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreview('');
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      badge: item.badge || '',
      icon: item.icon || 'tag',
      discountAmount: item.discountAmount || '',
      terms: item.terms || '',
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
      isActive: item.isActive,
      isFeatured: item.isFeatured,
      order: item.order || 0,
      image: null,
    });
    setPreview(item.imageUrl || '');
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
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
        await promotionsAPI.update(editing._id, formData);
        toast.success('Promotion updated');
      } else {
        await promotionsAPI.create(formData);
        toast.success('Promotion created');
      }
      setModalOpen(false);
      fetchPromotions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save promotion');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item) => {
    try {
      const formData = buildFormData({ isActive: !item.isActive });
      await promotionsAPI.update(item._id, formData);
      toast.success(item.isActive ? 'Promotion deactivated' : 'Promotion activated');
      fetchPromotions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await promotionsAPI.delete(deleteTarget._id);
      toast.success('Promotion deleted');
      setDeleteTarget(null);
      fetchPromotions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const isExpired = (date) => date && new Date(date) < new Date();

  const columns = [
    {
      key: 'title',
      label: 'Promotion',
      render: (row) => (
        <div>
          <p className="font-medium">{row.title}</p>
          {row.badge && <span className="text-xs text-teal">{row.badge}</span>}
        </div>
      ),
    },
    { key: 'discountAmount', label: 'Discount' },
    {
      key: 'expiryDate',
      label: 'Expires',
      render: (row) => (
        <span className={isExpired(row.expiryDate) ? 'text-red-500' : ''}>
          {row.expiryDate ? formatDate(row.expiryDate) : 'No expiry'}
        </span>
      ),
    },
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
          <h1 className="text-2xl font-bold text-navy">Promotions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage special offers and discounts</p>
        </div>
        <button type="button" onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark self-start">
          <FiPlus className="w-4 h-4" /> Add Promotion
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
      ) : (
        <DataTable columns={columns} data={promotions} emptyMessage="No promotions yet." />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-navy">{editing ? 'Edit Promotion' : 'Add Promotion'}</h3>
              <button type="button" onClick={() => setModalOpen(false)}><FiX className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={`admin-input ${errors.title ? 'border-red-500' : ''}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Badge</label>
                  <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="admin-input" placeholder="Limited Time" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Amount</label>
                  <input value={form.discountAmount} onChange={(e) => setForm({ ...form, discountAmount: e.target.value })} className="admin-input" placeholder="$200 off" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="admin-input" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`admin-input resize-none ${errors.description ? 'border-red-500' : ''}`} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Terms & Conditions</label>
                <textarea value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} rows={2} className="admin-input resize-none" />
              </div>

              <ImageUpload
                label="Promotion Image"
                preview={preview}
                onChange={(file) => { setForm({ ...form, image: file }); setPreview(URL.createObjectURL(file)); }}
                onClear={() => { setForm({ ...form, image: null }); setPreview(editing?.imageUrl || ''); }}
              />

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-gray-300 text-teal focus:ring-teal" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded border-gray-300 text-teal focus:ring-teal" />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg disabled:opacity-50">
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
        title="Delete Promotion"
        message={`Delete "${deleteTarget?.title}"?`}
        loading={deleting}
      />
    </div>
  );
};

export default Promotions;
