import type { UserPublic } from '@/api/user/userType';

export interface Feedback {
  feedbackID: string;
  user: UserPublic;
  timestamp: string;
  content: string;
  category: string;
}
