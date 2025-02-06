import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

// 定义返回数据的通用结构
interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

// 创建 axios 实例
const service = axios.create({
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 封装GET请求，带类型定义
export async function get<T>(url: string, params?: any): Promise<ResponseData<T>> {
  return service.get(url, { params }).then(response => response.data);
}

// 封装POST请求，带类型定义
export async function post<T>(url: string, data?: any, config?: any): Promise<ResponseData<T>> {
  return service.post(url, data, config).then(response => response.data);
}

export async function postRaw<T>(url: string, data?: any, config?: any): Promise<T> {
  return service.post(url, data, config).then(response => response.data);
}

// 封装DELETE请求，带类型定义
export async function del<T>(url: string, params?: any): Promise<ResponseData<T>> {
  return service.delete(url, { params }).then(response => response.data);
}

// 封装PUT请求，带类型定义
export async function put<T>(url: string, data?: any, config?: any): Promise<ResponseData<T>> {
  return service.put(url, data, config).then(response => response.data);
}
