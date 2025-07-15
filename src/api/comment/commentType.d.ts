import type { UserPublic } from '@/api/user/userType';

export interface Comment {
  commentId: string;
  user: UserPublic;
  timestamp: string;
  content: string;
  likes: number;
  liked: boolean;
  pinned: boolean;
  expId: string;
}

export interface CommentWithParent extends Comment {
  parentId: string | null;
}

export interface ChildComment extends Comment {
  parentComment: Comment | null;
}

export interface CommentWithChild extends Comment {
  childComments: ChildComment[];
}
