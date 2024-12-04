import type { UserPublic } from '@/api/user/userType';

export interface Post {
    title: string
    content: string
    timestamp: string
    user: UserPublic
  }