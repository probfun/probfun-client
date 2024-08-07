import axios from 'axios';

const API_URL = '';

export const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const register = (username, studentId, email, password) => {
  return axios.post(`${API_URL}/register`, { username, studentId, email, password });
};
