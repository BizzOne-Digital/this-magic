import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiStar, FiCheck, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { testimonialsAPI } from '../../services/api';
import { buildFormData, EVENT_TYPES } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import ConfirmModal from '../components/ConfirmModal';
import ImageUpload from '../components/ImageUpload';

const emptyForm = {
  clientName: '',
  eventType: '',
  rating: 5,
  review: '',
  location: '',
  eventDate: '',
  isActive: true,
  isFeatured: false,
  order: 0,
  image: null,
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await testimonialsAPI.getAll(true);
      setTestimonials(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
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
      clientName: item.clientName,
      eventType: item.eventType,
      rating: item.rating,
      review: item.review,
      location: item.location || '',
      eventDate: item.eventDate ? item.eventDate.split('T')[0] : '',
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
    if (!form.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!form.eventType) newErrors.eventType = 'Event type is required';
    if (!form.review.trim()) newErrors.review = 'Review is required';
    if (form.rating < 1 || form.rating > 5) newErrors.rating = 'Rating must be 1-5';
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
        await testimonialsAPI.update(editing._id, formData);
        toast.success('Testimonial updated');
      } else {
        await testimonialsAPI.create(formData);
        toast.success('Testimonial created');
      }
      setModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const toggleFeatured = async (item) => {
    try {
      const formData = buildFormData({ isFeatured: !item.isFeatured });
      await testimonialsAPI.update(item._id, formData);
      toast.success(item.isFeatured ? 'Removed from featured' : 'Marked as featured');
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await testimonialsAPI.delete(deleteTarget._id);
      toast.success('Testimonial deleted');
      setDeleteTarget(null);
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleApprove = async (item) => {
    try {
      await testimonialsAPI.approve(item._id);
      toast.success('Testimonial approved and published');
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (item) => {
    try {
      await testimonialsAPI.reject(item._id);
      toast.success('Testimonial rejected');
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    }
  };

  const filteredList = testimonials.filter((t) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Pending') return t.status === 'Pending';
    if (statusFilter === 'Approved') return t.status === 'Approved' || (!t.status && t.isActive);
    return true;
  });

  const pendingCount = testimonials.filter((t) => t.status === 'Pending').length;

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <FiStar key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ));

  const columns = [
    {
      key: 'clientName',
      label: 'Client',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No img</div>
          )}
          <div>
            <p className="font-medium">{row.clientName}</p>
            <p className="text-xs text-gray-500">{row.eventType}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={`status-badge ${
            row.status === 'Pending'
              ? 'bg-yellow-100 text-yellow-800'
              : row.status === 'Rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
          }`}
        >
          {row.status || (row.isActive ? 'Approved' : 'Inactive')}
        </span>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => <div className="flex">{renderStars(row.rating)}</div>,
    },
    {
      key: 'review',
      label: 'Review',
      render: (row) => <span className="line-clamp-2 max-w-xs">{row.review}</span>,
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      render: (row) => (
        <button
          type="button"
          onClick={() => toggleFeatured(row)}
          className={`status-badge cursor-pointer ${row.isFeatured ? 'bg-teal/20 text-teal' : 'bg-gray-100 text-gray-600'}`}
        >
          {row.isFeatured ? 'Featured' : 'Standard'}
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1 flex-wrap">
          {row.status === 'Pending' && (
            <>
              <button
                type="button"
                onClick={() => handleApprove(row)}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                title="Approve"
              >
                <FiCheck className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleReject(row)}
                className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg"
                title="Reject"
              >
                <FiXCircle className="w-4 h-4" />
              </button>
            </>
          )}
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
          <h1 className="text-2xl font-bold text-navy">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage client reviews and ratings</p>
        </div>
        <button type="button" onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark self-start">
          <FiPlus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Approved'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s ? 'bg-teal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s}
            {s === 'Pending' && pendingCount > 0 && (
              <span className="ml-2 bg-yellow-400 text-navy text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
      ) : (
        <DataTable columns={columns} data={filteredList} emptyMessage="No testimonials yet." />
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-navy">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button type="button" onClick={() => setModalOpen(false)}><FiX className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Client Name *</label>
                  <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className={`admin-input ${errors.clientName ? 'border-red-500' : ''}`} />
                  {errors.clientName && <p className="text-xs text-red-500 mt-1">{errors.clientName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Type *</label>
                  <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className={`admin-input ${errors.eventType ? 'border-red-500' : ''}`}>
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating *</label>
                  <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="admin-input">
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Date</label>
                  <input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="admin-input" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Review *</label>
                <textarea value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} rows={4} className={`admin-input resize-none ${errors.review ? 'border-red-500' : ''}`} />
              </div>

              <ImageUpload
                label="Client / Event Photo"
                preview={preview}
                uploading={saving}
                onChange={(file) => {
                  setForm({ ...form, image: file });
                  setPreview(URL.createObjectURL(file));
                }}
                onRemove={() => {
                  setForm({ ...form, image: null });
                  setPreview(editing?.imageUrl || '');
                }}
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
        title="Delete Testimonial"
        message={`Delete testimonial from ${deleteTarget?.clientName}?`}
        loading={deleting}
      />
    </div>
  );
};

export default Testimonials;
