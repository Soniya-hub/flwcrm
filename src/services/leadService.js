import api from './api';

function mapResponse(lead) {
  return { ...lead, assignedTo: lead.assignedToId };
}

export const leadService = {
  async getAll({ page = 0, size = 10, q = '', status = '' } = {}) {
    const params = { page, size };
    if (q) params.q = q;
    if (status && status !== 'ALL') params.status = status;
    const { data } = await api.get('/api/leads', { params });
    return {
      ...data,
      content: data.content.map(mapResponse),
    };
  },

  async create(formData) {
    const { assignedTo, ...rest } = formData;
    const { data } = await api.post('/api/leads', { ...rest, assignedToId: assignedTo || null });
    return mapResponse(data);
  },

  async update(id, formData) {
    const { assignedTo, ...rest } = formData;
    const { data } = await api.put(`/api/leads/${id}`, { ...rest, assignedToId: assignedTo || null });
    return mapResponse(data);
  },

  async delete(id) {
    await api.delete(`/api/leads/${id}`);
  },
};
