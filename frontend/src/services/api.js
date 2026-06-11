import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (username, password) => api.post('/login', { username, password }),
  signup: (username, email, password) => api.post('/signup', { username, email, password }),
};

export const customerService = {
  getAll: () => api.get('/customers'),
  add: (customer) => api.post('/customers', customer),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

export const leadService = {
  getAll: (status) => api.get('/leads', { params: { status } }),
  add: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
};

export const interactionService = {
  getAll: () => api.get('/interactions'),
  add: (data) => api.post('/interactions', data),
};

export const profileService = {
  get: () => api.get('/me'),
  update: (data) => api.put('/me/update', data),
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post('/me/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export default api;
