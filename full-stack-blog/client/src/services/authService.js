import api from './api';

const authService = {
  async register(values) {
    const { data } = await api.post('/auth/register', values);
    return data.user;
  },
  async login(values) {
    const { data } = await api.post('/auth/login', values);
    return data.user;
  },
  async logout() {
    await api.post('/auth/logout');
  },
  async getCurrentUser() {
    const { data } = await api.get('/auth/me');
    return data.user;
  },
};

export default authService;