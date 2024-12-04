import type { Post } from "./classType";
import { get, post } from '../request';

export async function postPostApi(title: string, content: string, classes: string[]) {
    const result = await post<{
        post: Post
    }>(`/api/classes/post`, {
        title,
        content,
        classes
    });
    return result.data;
}

export async function fetchPostApi(classId: string) {
    const result = await get<{
        posts: Post[]
    }>(`/api/classes/${classId}/post`);
    return result.data
}