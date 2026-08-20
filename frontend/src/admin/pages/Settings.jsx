import { useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { settingsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    ownerName: '',
    sendCustomerConfirmation: true,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    settingsAPI
      .get()
      .then((res) => setSettings(res.data.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!settings.siteName?.trim()) newErrors.siteName = 'Site name is required';
    if (!settings.ownerName?.trim()) newErrors.ownerName = 'Owner name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await settingsAPI.update(settings);
      setSettings(res.data.data);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Configure site-wide settings</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-dark disabled:opacity-50 self-start"
        >
          {saving ? <LoadingSpinner size="sm" /> : <FiSave className="w-4 h-4" />}
          Save Settings
        </button>
      </div>

      <div className="admin-card space-y-6 max-w-2xl">
        <div>
          <h2 className="text-lg font-semibold text-navy mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Name</label>
              <input
                value={settings.siteName || ''}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className={`admin-input ${errors.siteName ? 'border-red-500' : ''}`}
              />
              {errors.siteName && <p className="text-xs text-red-500 mt-1">{errors.siteName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Owner Name</label>
              <input
                value={settings.ownerName || ''}
                onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                className={`admin-input ${errors.ownerName ? 'border-red-500' : ''}`}
              />
              {errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-navy mb-4">Email Notifications</h2>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.sendCustomerConfirmation ?? true}
              onChange={(e) => setSettings({ ...settings, sendCustomerConfirmation: e.target.checked })}
              className="mt-1 rounded border-gray-300 text-teal focus:ring-teal"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Send customer confirmation emails</span>
              <p className="text-xs text-gray-500 mt-0.5">
                When enabled, customers receive an automatic confirmation email after submitting a contact form.
              </p>
            </div>
          </label>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-navy mb-4">Maintenance</h2>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode ?? false}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="mt-1 rounded border-gray-300 text-teal focus:ring-teal"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Maintenance mode</span>
              <p className="text-xs text-gray-500 mt-0.5">
                When enabled, the public website may display a maintenance message.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
