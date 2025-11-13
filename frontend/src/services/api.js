// frontend/src/api/api.js
import axios from 'axios';

// Define a URL base da API — em produção ou desenvolvimento
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // backend Express
});

// Intercepta e adiciona o token JWT (se existir)
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
}, err => Promise.reject(err))

// =======================
//  ROTAS DE AUTENTICAÇÃO
// =======================
export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  if (res.data?.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

// =======================
//  ROTAS DE MATERIAIS
// =======================
export const getMateriais = async () => {
  const res = await api.get('/materiais');
  return res.data;
};

export const getMaterialById = async (id) => {
  const res = await api.get(`/materiais/${id}`);
  return res.data;
};

// =======================
//  ROTAS DE EMPRÉSTIMOS
// =======================
export const getEmprestimosByUser = async (userId) => {
  const res = await api.get(`/emprestimos/user/${userId}`);
  return res.data;
};

export const createEmprestimo = async (userId, materialId) => {
  const res = await api.post('/emprestimos', { userId, materialId });
  return res.data;
};

export const devolverEmprestimo = async (id) => {
  const res = await api.put(`/emprestimos/${id}/devolver`);
  return res.data;
};

export const getAtrasados = async () => {
  const res = await api.get('/emprestimos/atrasados');
  return res.data;
};

export default api;
