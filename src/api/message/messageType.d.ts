import type { UserPublic } from '@/api/user/userType';
import type { Comment } from '@/api/comment/commentType';

export interface LikeData {
  comment: Comment
  user: UserPublic
}

export interface Post {
  title: string
  content: string
  timestamp: string
  user: UserPublic
}

export interface PostData {
  post: Post
}

export interface ReplyData {
  comment: Comment
  reply: Comment
}

export interface PinData {
  comment: Comment
  user: UserPublic
}

export interface ChosenData {
  comment: Comment
  user: UserPublic
}

export interface Message {
  messageId: string
  read: boolean
  timestamp: string
  type: string
  user: UserPublic
  likeData: LikeData | null
  postData: PostData | null
  replyData: ReplyData | null
  pinData: PinData | null
  chosenData: ChosenData | null
}
