import type { UserPublic } from '@/api/user/userType';

export interface Comment {
  commentId: string
  user: UserPublic
  timestamp: string
  content: string
  likes: number
  liked: boolean
  expId: string
  parentId: string
}
