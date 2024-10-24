import type { CommentWithParent } from './commentType';
import { del, get, post } from '../request';

export async function fetchCommentApi(expId: string) {
  const result = await get<{
    comments: CommentWithParent[]
  }>(`/api/comment/${expId}`);
  return result.data;
}

export async function postCommentApi(expId: string, content: string, parentId: string | null) {
  const result = await post<{
    comment: CommentWithParent
  }>(`/api/comment/${expId}`, {
    content,
    parentId,
  });
  return result.data;
}

export async function likeCommentApi(commentId: string) {
  const result = await post<{
    liked: boolean
    likes: number
  }>(`/api/comment/${commentId}/like`);
  return result.data;
}

export async function deleteCommentApi(commentId: string) {
  const result = await del<object>(`/api/comment/${commentId}`);
  return result.data;
}

export async function chooseCommentApi(commentId: string) {
  const result = await post<{
    chosen: boolean
  }>(`/api/comment/${commentId}/choose`);
  return result.data;
}

export async function pinCommentApi(commentId: string) {
  const result = await post<{
    pinned: boolean
  }>(`/api/comment/${commentId}/pin`);
  return result.data;
}
