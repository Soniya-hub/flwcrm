import api from './api';

function mapResponse(task) {
  return { ...task, assignedTo: task.assignedToId };
}

export const taskService = {
  async getAll({ page = 0, size = 10, q = '', status = '', priority = '' } = {}) {
    const params = { page, size };
    if (q) params.q = q;
    if (status && status !== 'ALL') params.status = status;
    if (priority && priority !== 'ALL') params.priority = priority;
    const { data } = await api.get('/api/tasks', { params });
    return {
      ...data,
      content: data.content.map(mapResponse),
    };
  },

  async create(formData) {
    const { assignedTo, ...rest } = formData;
    const { data } = await api.post('/api/tasks', { ...rest, assignedToId: assignedTo || null });
    return mapResponse(data);
  },

  async update(id, formData) {
    const { assignedTo, ...rest } = formData;
    const { data } = await api.put(`/api/tasks/${id}`, { ...rest, assignedToId: assignedTo || null });
    return mapResponse(data);
  },

  async delete(id) {
    await api.delete(`/api/tasks/${id}`);
  },
};
