// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '', // 替换为你的API基础URL
  timeout: 1000,
});

export default api;
