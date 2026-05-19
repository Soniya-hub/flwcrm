import { MOCK_USERS } from "../data/mockData";

let users = MOCK_USERS.map(({ password: _, ...u }) => u);
let nextId = users.length + 1;

function delay(ms = 300) {
  return new Promise(r => setTimeout(r, ms));
}

export const userService = {
  async getAll() {
    await delay();
    return [...users];
  },

  async create(data) {
    await delay();
    const user = { ...data, id: nextId++, createdAt: new Date().toISOString().split("T")[0] };
    users.push(user);
    return user;
  },

  async update(id, data) {
    await delay();
    users = users.map(u => u.id === id ? { ...u, ...data } : u);
    return users.find(u => u.id === id);
  },

  async delete(id) {
    await delay();
    users = users.filter(u => u.id !== id);
  },
};
