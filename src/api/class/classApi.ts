import type { Class, Post } from './classType';
import type { User } from '@/api/user/userType';
import { del, get, post } from '../request';

async function postPostApi(title: string, content: string, teachingClassIds: string[]) {
  const result = await post<{
    post: Post;
  }>(`/class/post/`, {
    title,
    content,
    teachingClassIds,
  });
  return result.data;
}

async function fetchPostApi(classId: string) {
  const result = await get<{
    posts: Post[];
  }>(`/class/post/list/`, {
    teachingClassIds: [classId],
  });
  return result.data;
}

async function fetchStudentClassListApi() {
  const result = await get<{
    teachingClasses: Class[];
  }>(`/class/student/teaching-class/list/`);
  return result.data;
}

async function joinClassApi(code: string) {
  const result = await post<null>(`/class/student/join/`, {
    code,
  });
  return result.data;
}

async function quitClassApi(classId: string) {
  const result = await post<null>(`/class/student/exit/`, {
    classId,
  });
  return result.data;
}

async function createClassApi(name: string) {
  const result = await post<{
    teaching_class_id: string;
    name: string;
    code: string;
  }>(`/class/teacher/create/`, {
    name,
  });
  return result.data;
}

async function fetchTeacherClassListApi() {
  const result = await get<{
    teachingClasses: Class[];
  }>(`/class/teacher/teaching-class/list/`);
  return result.data;
}

async function deleteClassApi(classId: string) {
  const result = await del<null>(`/class/teacher/delete/${classId}/`, {
    classId,
  });
  return result.data;
}

async function fetchStudentListApi(classId: string) {
  const result = await get<{
    students: User[];
  }>(`/class/teacher/student/list/`, {
    classId,
  });
  return result.data;
}

export {
  createClassApi,
  deleteClassApi,
  fetchPostApi,
  fetchStudentClassListApi,
  fetchStudentListApi,
  fetchTeacherClassListApi,
  joinClassApi,
  postPostApi,
  quitClassApi,
};
