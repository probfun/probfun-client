import type { Message } from './messageType';
import { get, post } from '../request';

export async function fetchMessagesApi() {
  const result = await get<{
    messages: Message[]
  }>(`/api/message`);
  return result.data;
}

export async function readMessagesApi() {
  const result = await post<{
    messages: Message[]
  }>(`/api/message/read`);
  return result.data;
}
