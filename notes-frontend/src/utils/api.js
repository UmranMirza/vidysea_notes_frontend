import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vidysea-notes-backend.onrender.com/',
//   baseURL: 'http://127.0.0.1:8000/',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Sample API Calls
export const login = (data) => api.post('/app/auth/login', data);
export const signup = (data) => api.post('/app/auth/register', data);
export const getNotes = (params) => api.get('/app/notes/', { params });
export const createNote = (data) => api.post('/app/notes/create', data);
export const editNote = (id, data) => api.put(`/app/notes/edit/${id}`, data);
export const deleteNote = (id) => api.delete(`/app/notes/delete/${id}`);
export const getAllNotes = (params) => api.get('/app/notes/all', { params });
// ...admin APIs