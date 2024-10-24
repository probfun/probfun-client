import type { UserPublic } from '@/api/user/userType';

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
  likeData: LikeData | null
  postData: PostData | null
  replyData: ReplyData | null
  pinData: PinData | null
  chosenData: ChosenData | null
}
