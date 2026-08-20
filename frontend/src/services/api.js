import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // FormData needs browser-set boundary — don't force Content-Type
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Leads
export const leadsAPI = {
  create: (data) => api.post('/leads', data),
  getAll: (params) => api.get('/leads', { params }),
  getOne: (id) => api.get(`/leads/${id}`),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  getStats: () => api.get('/leads/stats'),
};

// Services
export const servicesAPI = {
  getAll: (all = false) => api.get('/services', { params: { all } }),
  getOne: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Testimonials
export const testimonialsAPI = {
  getAll: (all = false) => api.get('/testimonials', { params: { all } }),
  submit: (data) => api.post('/testimonials/submit', data),
  create: (data) => api.post('/testimonials', data),
  update: (id, data) => api.put(`/testimonials/${id}`, data),
  approve: (id) => api.put(`/testimonials/${id}/approve`),
  reject: (id) => api.put(`/testimonials/${id}/reject`),
  delete: (id) => api.delete(`/testimonials/${id}`),
};

// Promotions
export const promotionsAPI = {
  getAll: (all = false) => api.get('/promotions', { params: { all } }),
  create: (data) => api.post('/promotions', data),
  update: (id, data) => api.put(`/promotions/${id}`, data),
  delete: (id) => api.delete(`/promotions/${id}`),
};

// Gallery
export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }),
  create: (data) => api.post('/gallery', data),
  bulkCreate: (data) => api.post('/gallery/bulk', data),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
  reorder: (items) => api.put('/gallery/reorder', { items }),
};

// Content
export const contentAPI = {
  get: () => api.get('/content'),
  update: (data) => api.put('/content', data),
  uploadHero: (data) => api.post('/content/hero-image', data),
  removeHero: () => api.delete('/content/hero-image'),
  uploadLogo: (data) => api.post('/content/logo', data),
  removeLogo: () => api.delete('/content/logo'),
  uploadAbout: (data) => api.post('/content/about-image', data),
  removeAboutImage: (index) => api.delete(`/content/about-image/${index}`),
  clearAboutImages: () => api.delete('/content/about-images'),
  uploadAboutPageHero: (data) => api.post('/content/about-page/hero', data),
  removeAboutPageHero: () => api.delete('/content/about-page/hero'),
  uploadAboutPageStory: (data) => api.post('/content/about-page/story', data),
  removeAboutPageStory: () => api.delete('/content/about-page/story'),
};

// Settings
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  getDashboard: () => api.get('/settings/dashboard'),
};

// Upload
export const uploadAPI = {
  image: (data) => api.post('/upload', data),
};

export default api;
