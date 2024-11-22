import type { Post } from '../message/messageType';
import { get } from '../request';

export async function fetchPostApi() {
    const result = await get<{
        post: Post[]
    }>('/api/post');
    return result.data;
}