import type { CommentWithParent } from './commentType';
import { del, get, post } from '../request';

export async function fetchCommentApi(expId: string) {
  const result = await get<{
    comments: CommentWithParent[];
  }>(`/experiment/comment/${expId}/`);
  return result.data;
}

export async function postCommentApi(expId: string, content: string, parentId: string | null) {
  const result = await post<{
    comment: CommentWithParent;
  }>(`/experiment/comment/${expId}/`, {
    content,
    parentId,
  });
  return result.data;
}

export async function likeCommentApi(commentId: string) {
  const result = await post<{
    liked: boolean;
    likes: number;
  }>(`/experiment/comment/${commentId}/like/`);
  return result.data;
}

export async function deleteCommentApi(commentId: string) {
  const result = await del<object>(`/experiment/comment/${commentId}/`);
  return result.data;
}

export async function pinCommentApi(commentId: string) {
  const result = await post<{
    pinned: boolean;
  }>(`/experiment/comment/${commentId}/pin/`);
  return result.data;
}

export async function featureCommentApi(commentId: string) {
  const result = await post<{
    featured: boolean;
  }>(`/experiment/comment/${commentId}/choose/`);
  return result.data;
}
