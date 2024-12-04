import type { Post } from '@/api/class/classType';
import { get } from '../request';

export async function fetchPostApi(classId: string) {
  const result = await get<{
    posts: Post[]
  }>(`/api/classes/${classId}/post`);
  return result.data;
}
