export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    New: 'bg-blue-100 text-blue-800',
    Contacted: 'bg-yellow-100 text-yellow-800',
    'Follow Up': 'bg-orange-100 text-orange-800',
    Booked: 'bg-green-100 text-green-800',
    Closed: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const buildFormData = (data, fileField = 'image') => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else if (typeof value === 'boolean') {
      formData.append(key, value.toString());
    } else {
      formData.append(key, value);
    }
  });
  if (data[fileField] instanceof File) {
    formData.set(fileField, data[fileField]);
  }
  return formData;
};

export const truncate = (str, length = 100) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const EVENT_TYPES = [
  'Wedding',
  'Sweet 16',
  'Birthday Party',
  'Corporate Event',
  'Anniversary',
  'Bar/Bat Mitzvah',
  'Holiday Party',
  'Fundraiser/Gala',
  'Private Event',
  'Other',
];

export const SERVICE_OPTIONS = [
  'Wedding DJ',
  'Sweet 16 DJ',
  'Birthday DJ',
  'Private Event DJ',
  'Photo Booth',
  'Photography',
  'Videography',
  'Complete Package',
];

export const HEAR_ABOUT_OPTIONS = [
  'Google Search',
  'Instagram',
  'Facebook',
  'Referral from Friend/Family',
  'Wedding Wire/The Knot',
  'Previous Client',
  'Event Venue',
  'Other',
];

export const fileNameToTitle = (filename) =>
  filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const buildBulkGalleryFormData = (files, items, defaultCategory, startOrder = 0) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  formData.append(
    'items',
    JSON.stringify(items.map(({ title, category, caption }) => ({ title, category, caption })))
  );
  formData.append('defaultCategory', defaultCategory);
  formData.append('startOrder', String(startOrder));
  return formData;
};

export const GALLERY_CATEGORIES = [
  'Weddings',
  'Sweet 16s',
  'Birthdays',
  'DJ',
  'Photo Booth',
  'Photography',
  'Videography',
  'General',
];

export const LEAD_STATUSES = ['New', 'Contacted', 'Follow Up', 'Booked', 'Closed'];
