import type { UserPublic } from '@/api/user/userType';
import { Experiment } from '@/api/experiment/experimentType';

export interface Post {
  title: string
  content: string
  timestamp: string
  user: UserPublic
}

export interface ClickCount {
  experiment: Experiment
  clickCount: number
}

export interface CommentCount {
  experiment: Experiment
  commentCount: number
}

export interface FavoriteCount {
  experiment: Experiment
  favoriteCount: number
}

export interface Time {
  experiment: Experiment
  time: number
}

export interface PersonalExperimentData {
  mostClick: Experiment
  mostTime: Experiment
}

export interface ClassExperimentData {
  mostClick: Experiment
  mostTime: Experiment
  mostFavorite: Experiment
  mostComment: Experiment
}

export interface Mydata {
  likeCount: number
  commentCount: number
  replyCount: number
  pinCount: number
  personalExperimentData: PersonalExperimentData
  classExperimentData: ClassExperimentData
}