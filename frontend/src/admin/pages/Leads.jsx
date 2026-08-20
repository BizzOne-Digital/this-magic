import { useEffect, useState, useCallback } from 'react';
import { FiEye, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { leadsAPI } from '../../services/api';
import { formatDate, formatDateTime, LEAD_STATUSES, EVENT_TYPES } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', internalNotes: '' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await leadsAPI.getAll(params);
      setLeads(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 300);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const openLead = (lead) => {
    setSelectedLead(lead);
    setEditForm({ status: lead.status, internalNotes: lead.internalNotes || '' });
  };

  const handleSave = async () => {
    if (!selectedLead) return;
    setSaving(true);
    try {
      const res = await leadsAPI.update(selectedLead._id, editForm);
      toast.success('Lead updated');
      setSelectedLead(res.data.data);
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await leadsAPI.delete(deleteTarget._id);
      toast.success('Lead deleted');
      setDeleteTarget(null);
      if (selectedLead?._id === deleteTarget._id) setSelectedLead(null);
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lead');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'eventType', label: 'Event Type' },
    {
      key: 'eventDate',
      label: 'Event Date',
      render: (row) => formatDate(row.eventDate),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      label: 'Submitted',
      render: (row) => formatDateTime(row.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => openLead(row)}
            className="p-1.5 text-teal hover:bg-teal/10 rounded-lg transition-colors"
            title="View / Edit"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Leads</h1>
        <p className="text-gray-500 text-sm mt-1">Manage customer inquiries and bookings</p>
      </div>

      {loading && leads.length === 0 ? (
        <div className="flex justify-center py-24">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={leads}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name, email, phone..."
          filters={
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-input w-auto min-w-[140px]"
            >
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          }
        />
      )}

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-navy">{selectedLead.name}</h3>
                <p className="text-sm text-gray-500">{formatDateTime(selectedLead.createdAt)}</p>
              </div>
              <button type="button" onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Email</p>
                  <p className="text-sm font-medium">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Phone</p>
                  <p className="text-sm font-medium">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Event Type</p>
                  <p className="text-sm font-medium">{selectedLead.eventType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Event Date</p>
                  <p className="text-sm font-medium">{formatDate(selectedLead.eventDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Location</p>
                  <p className="text-sm font-medium">{selectedLead.eventLocation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Guest Count</p>
                  <p className="text-sm font-medium">{selectedLead.guestCount || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Heard About Us</p>
                  <p className="text-sm font-medium">{selectedLead.hearAboutUs || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Services Interested</p>
                  <p className="text-sm font-medium">
                    {selectedLead.interestedServices?.length
                      ? selectedLead.interestedServices.join(', ')
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Message</p>
                <p className="text-sm bg-gray-50 rounded-lg p-3">{selectedLead.message}</p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="admin-input"
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Internal Notes</label>
                  <textarea
                    value={editForm.internalNotes}
                    onChange={(e) => setEditForm({ ...editForm, internalNotes: e.target.value })}
                    rows={4}
                    className="admin-input resize-none"
                    placeholder="Add private notes about this lead..."
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-between">
              <button
                type="button"
                onClick={() => setDeleteTarget(selectedLead)}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete Lead
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors disabled:opacity-50"
              >
                {saving ? <LoadingSpinner size="sm" /> : <FiSave className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete the lead from ${deleteTarget?.name}? This cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
};

export default Leads;
