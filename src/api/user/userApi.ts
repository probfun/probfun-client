import type { User } from './userType';
import { get, post, put } from '../request';

export async function isValidApi(studentId: string) {
  const result = await post<{
    isValid: number
  }>('/api/user/valid', {
    studentId,
  });
  return result.data;
}

export async function loginApi(studentId: string, password: string) {
  const result = await post<{
    token: string
    user: User & { token: string }
  }>('/api/user/login', {
    studentId,
    password,
  });
  return result.data;
}

export async function registerApi(studentId: string, password: string, nickname: string, gender: number, email: string, phone: string, major: string, school: string) {
  const result = await post<{
    user: User
  }>('/api/user/register', {
    studentId,
    password,
    nickname,
    gender,
    email,
    phone,
    major,
    school,
  });
  return result.data;
}

export async function fetchUserApi() {
  const result = await get<{
    user: User
  }>('/api/user');
  return result.data;
}

export async function putUserApi(
  nickname: string,
  gender: number,
  email: string,
  phone: string,
  major: string,
  school: string,
) {
  const result = await put<{
    user: User
  }>('/api/user', {
    nickname,
    gender,
    email,
    phone,
    major,
    school,
  });
  return result.data;
}

export async function putUserAvatarApi(avatar: File) {
  const formData = new FormData();
  formData.append('avatar', avatar);
  const result = await put<{
    user: User
  }>('/api/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return result.data;
}
