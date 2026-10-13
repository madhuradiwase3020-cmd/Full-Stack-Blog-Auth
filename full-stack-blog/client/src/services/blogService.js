import api from './api';

const blogService = {
  async list(category) {
    const { data } = await api.get('/blogs', {
      params: category && category !== 'All' ? { category } : undefined,
    });
    return data.blogs;
  },
  async get(id) {
    const { data } = await api.get(`/blogs/${id}`);
    return data.blog;
  },
  async listMine() {
    const { data } = await api.get('/blogs/mine');
    return data.blogs;
  },
  async create(values) {
    const { data } = await api.post('/blogs', values);
    return data.blog;
  },
  async update(id, values) {
    const { data } = await api.patch(`/blogs/${id}`, values);
    return data.blog;
  },
  async remove(id) {
    await api.delete(`/blogs/${id}`);
  },
};

export default blogService;