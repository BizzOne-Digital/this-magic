import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiUserPlus,
  FiBriefcase,
  FiStar,
  FiTag,
  FiImage,
  FiArrowRight,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { settingsAPI } from '../../services/api';
import { formatDateTime } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

const statCards = [
  { key: 'totalLeads', label: 'Total Leads', icon: FiUsers, color: 'bg-blue-500' },
  { key: 'newLeads', label: 'New Leads', icon: FiUserPlus, color: 'bg-teal' },
  { key: 'totalServices', label: 'Active Services', icon: FiBriefcase, color: 'bg-purple-500' },
  { key: 'totalTestimonials', label: 'Testimonials', icon: FiStar, color: 'bg-yellow-500' },
  { key: 'activePromotions', label: 'Promotions', icon: FiTag, color: 'bg-green-500' },
  { key: 'totalGallery', label: 'Gallery Items', icon: FiImage, color: 'bg-pink-500' },
];

const quickActions = [
  { to: '/admin/leads', label: 'View Leads', desc: 'Manage inquiries' },
  { to: '/admin/services', label: 'Manage Services', desc: 'Update offerings' },
  { to: '/admin/content', label: 'Edit Content', desc: 'Update website copy' },
  { to: '/admin/gallery', label: 'Gallery', desc: 'Upload photos' },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsAPI
      .getDashboard()
      .then((res) => setStats(res.data.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const leadColumns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-medium">{row.name}</span> },
    { key: 'eventType', label: 'Event' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => formatDateTime(row.createdAt),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your business activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="admin-card flex items-center gap-4">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stats?.[key] ?? 0}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-navy">Recent Leads</h2>
            <Link to="/admin/leads" className="text-sm text-teal hover:text-teal-dark flex items-center gap-1">
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <DataTable
            columns={leadColumns}
            data={stats?.recentLeads || []}
            emptyMessage="No leads yet."
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-navy mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map(({ to, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="admin-card flex items-center justify-between hover:border-teal/30 hover:shadow-md transition-all group"
              >
                <div>
                  <p className="font-medium text-navy group-hover:text-teal transition-colors">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
