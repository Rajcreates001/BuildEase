import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});


// Attach token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('buildease_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Normalize validation errors from express-validator
      if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.message = error.response.data.errors.map(e => e.msg).join(', ');
      }
    } else if (error.request) {
      // Network error - no response received
      error.response = { data: { message: 'Network error. Please check if the server is running.' } };
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Projects
export const getProjects = (params) => API.get('/projects', { params });
export const getMyProjects = () => API.get('/projects/my');
export const getProject = (id) => API.get(`/projects/${id}`);
export const createProject = (data) => API.post('/projects', data);
export const submitBid = (id, data) => API.post(`/projects/${id}/bid`, data);
export const updateProgress = (id, data) => API.put(`/projects/${id}/progress`, data);

// Marketplace
export const getMarketplaceItems = (params) => API.get('/marketplace', { params });
export const createOrder = (data) => API.post('/marketplace/orders', data);
export const getOrders = () => API.get('/marketplace/orders');

// Contractors
export const getContractors = (params) => API.get('/contractors', { params });
export const getContractor = (id) => API.get(`/contractors/${id}`);

// Workers
export const getWorkers = () => API.get('/workers');
export const addWorker = (data) => API.post('/workers', data);
export const updateWorker = (id, data) => API.put(`/workers/${id}`, data);
export const deleteWorker = (id) => API.delete(`/workers/${id}`);

// Budget (basic - fallback)
export const calculateEstimate = (data) => API.post('/budget/estimate', data);
export const calculateQuotation = (data) => API.post('/budget/quotation', data);
export const calculatePrediction = (data) => API.post('/budget/prediction', data);
export const getMarketRates = () => API.get('/budget/rates');

// AI/ML (Python service via proxy)
export const generateBlueprint = (data) => API.post('/ai/blueprint', data);
export const aiEstimate = (data) => API.post('/ai/estimate', data);
export const aiQuotation = (data) => API.post('/ai/quotation', data);
export const aiPrediction = (data) => API.post('/ai/prediction', data);
export const getAIMarketRates = () => API.get('/ai/market-rates');

// Notifications
export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);

export default API;
