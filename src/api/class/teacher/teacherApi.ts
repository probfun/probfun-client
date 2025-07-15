import type { ClickCount, CommentCount, FavoriteCount, Time } from '@/api/class/classType.d.ts';
import type { Comment } from '@/api/comment/commentType';
import { get } from '@/api/request';

export async function fetchCommentsApi(classId: string, period: 'CURRENT_TERM' | 'LAST_MONTH' | 'ALL_TIME') {
  const result = await get<{
    comments: Comment[];
  }>(`/api/classes/${classId}/comments`, { period });
  return result.data;
}

export async function fetchClickCountApi(classId: string, period: 'CURRENT_TERM' | 'LAST_MONTH' | 'ALL_TIME') {
  const result = await get<{
    clicks: ClickCount[];
  }>(`/api/classes/${classId}/experiments/click`, { period });
  return result.data;
}

export async function fetchCommentCountApi(classId: string, period: 'CURRENT_TERM' | 'LAST_MONTH' | 'ALL_TIME') {
  const result = await get<{
    comments: CommentCount[];
  }>(`/api/classes/${classId}/experiments/comment`, { period });
  return result.data;
}

export async function fetchFavoriteCountApi(classId: string, period: 'CURRENT_TERM' | 'LAST_MONTH' | 'ALL_TIME') {
  const result = await get<{
    favorites: FavoriteCount[];
  }>(`/api/classes/${classId}/experiments/favorite`, { period });
  return result.data;
}

export async function fetchTimeApi(classId: string, period: 'CURRENT_TERM' | 'LAST_MONTH' | 'ALL_TIME') {
  const result = await get<{
    times: Time[];
  }>(`/api/classes/${classId}/experiments/time`, { period });
  return result.data;
}
