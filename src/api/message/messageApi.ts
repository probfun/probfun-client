import type { Message, Post } from './messageType';
import { get, post } from '../request';

export async function fetchMessagesApi() {
  const result = await get<{
    messages: Message[]
  }>(`/api/message`);
  return result.data;
}

export async function postPostApi(title: string, content: string) {
  const result = await post<{
    post: Post
  }>(`/api/message/post`, {
    title,
    content,
  });
  return result.data;
}

export async function readMessagesApi() {
  const result = await post<{
    messages: Message[]
  }>(`/api/message/read`);
  return result.data;
}
