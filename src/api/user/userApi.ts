import type { User } from './userType';
import { get, post, put } from '../request';

export async function isValidApi(username: string) {
  const result = await post<{
    isValid: number;
  }>('/user/valid/', {
    username,
  });
  return result.data;
}

export async function loginApi(username: string, password: string) {
  const result = await post<{
    token: string;
    user: User;
  }>('/auth/login/', {
    username,
    password,
  });
  return result.data;
}

export async function signupApi(username: string, password: string, nickname: string, gender: number, email: string, phone: string, major: string, school: string) {
  const result = await post<{
    user: User;
  }>('/auth/register/', {
    username,
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
    user: User;
  }>('/user/');
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
    user: User;
  }>('/user/', {
    nickname,
    gender,
    email,
    phone,
    major,
    school,
  });
  return result.data;
}

export async function updatePasswordApi(
  oldPassword: string,
  newPassword: string,
) {
  const result = await put<{
    user: User;
  }>('/user/password/', {
    oldPassword,
    newPassword,
  });
  return result.data;
}

export async function putUserAvatarApi(avatar: File) {
  const formData = new FormData();
  formData.append('avatar', avatar);
  const result = await put<{
    user: User;
  }>('/user/avatar/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return result.data;
}

export async function casValidateApi(ticket: string) {
  const response = await get<{
    user: User;
    token: string;
  }>(`/user/validate/?ticket=${ticket}`);
  return response.data;
}
