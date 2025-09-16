import type { Message } from './messageType';
import { get, post } from '../request';

export async function fetchMessagesApi() {
  const result = await get<{
    messages: Message[]
  }>(`/message`);
  return result.data;
}

export async function readMessagesApi() {
  const result = await post<{
    messages: Message[]
  }>(`/message/read`);
  return result.data;
}
