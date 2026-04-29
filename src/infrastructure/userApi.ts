import axios from 'axios';
import type { UserService } from '../application/userService';

const API_URL = import.meta.env.VITE_API_URL;

export const userApi: UserService = {
  async listUsers() {
    const { data } = await axios.get(`${API_URL}/users`);
    return data.data !== undefined ? data.data : data;
  },
  async getUser(id: number) {
    const { data } = await axios.get(`${API_URL}/users/${id}`);
    return data.data !== undefined ? data.data : data;
  },
  async createUser(user) {
    const { data } = await axios.post(`${API_URL}/users`, user);
    return data.data !== undefined ? data.data : data;
  },
  async updateUser(id, user) {
    const { data } = await axios.put(`${API_URL}/users/${id}`, user);
    return data.data !== undefined ? data.data : data;
  },
  async deleteUser(id) {
    await axios.delete(`${API_URL}/users/${id}`);
  },
};
