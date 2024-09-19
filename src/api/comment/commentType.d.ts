export interface Comment {
    commentID: string;
    user: {
        uid: string;
        nickname: string;
        avatarUrl: string;
    };
    timestamp: string;
    content: string;
    likes: number;
    expId: string;
    parentId: string | null;
}