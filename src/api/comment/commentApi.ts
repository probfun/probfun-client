import { get, post, del } from "../request";
import { Comment } from "./commentType";

export async function getCommentApi(expID: string) {
    const result = await get<{ comment: Comment }>(`/api/comment/${expID}`);
    return result.data;
}

export async function addCommentApi(expID: string, content: string, parentID: string) {
    const result = await post<{ comment: Comment }>(`/api/comment/${expID}`, {
        content,
        parentID,
    });
    return result.data;
}

export async function likeCommentApi(commentId: string) {
    const result = await post<{ comment: Comment }>(`/api/comment/${commentId}`);
    return result.data;
}

export async function deleteCommentApi(commentId: string) {
    const result = await del<{ comment: Comment }>(`/api/comment/${commentId}`);
    return result.data;
}