import type { Experiment } from '@/api/experiment/experimentType';
import type { UserPublic } from '@/api/user/userType';

export interface Post {
  title: string;
  content: string;
  timestamp: string;
  author: UserPublic;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  createAt: string;
}

export interface ClickCount {
  experiment: Experiment;
  clickCount: number;
}

export interface CommentCount {
  experiment: Experiment;
  commentCount: number;
}

export interface FavoriteCount {
  experiment: Experiment;
  favoriteCount: number;
}

export interface Time {
  experiment: Experiment;
  time: number;
}

export interface PersonalExperimentData {
  mostClick: Experiment;
  mostTime: Experiment;
}

export interface ClassExperimentData {
  mostClick: Experiment;
  mostTime: Experiment;
  mostFavorite: Experiment;
  mostComment: Experiment;
}

export interface Mydata {
  likeCount: number;
  commentCount: number;
  replyCount: number;
  pinCount: number;
  personalExperimentData: PersonalExperimentData;
  classExperimentData: ClassExperimentData;
}

export interface ClassAnalytics {
  classOverview: ClassOverview;
  studentDetails: StudentDetail[];
  insights: Insights;
}

export interface ClassOverview {
  totalStudents: number;
  teachingClassName: string;
  knowledgePoints: KnowledgePointOverview[];
  studentPerformance: StudentPerformance[];
  activityDistribution: ActivityDistributionEntry[];
}

export interface KnowledgePointOverview {
  knowledgePointId: number;
  knowledgePointName: string;
  averageAccuracy: number;
  averageAttempts: number;
  totalAttempts: number;
  studentCount: number;
}

export interface StudentPerformance {
  studentId: number;
  studentName: string;
  completedQuestions: number;
  accuracy: number;
  studyDuration: number;
}

export interface ActivityDistributionEntry {
  studentId: number;
  studentName: string;
  timeDistribution: TimeDistribution;
  totalTime: number;
  dominantActivity: string;
}

export interface TimeDistribution {
  answerQuestions: number;
  aiChat: number;
  browseResources: number;
  discussion: number;
}

export interface StudentDetail {
  studentId: number;
  studentName: string;
  learningTrajectory: LearningTrajectoryEntry[];
  knowledgeDetails: KnowledgeDetailEntry[];
}

export interface LearningTrajectoryEntry {
  date: string;
  completedQuestions: number;
  accuracy: number;
  totalAttempts: number;
}

export interface KnowledgeDetailEntry {
  knowledgePointId: number;
  knowledgePointName: string;
  accuracy: number;
  averageAttempts: number;
  totalAttempts: number;
}

export interface Insights {
  frequentMistakes: FrequentMistake[];
  chatKeywords: ChatKeyword[];
}

export interface FrequentMistake {
  questionId: number;
  questionContent: string;
  knowledgePoint: string;
  mistakeCount: number;
  studentCount: number;
}

export interface ChatKeyword {
  keyword: string;
  frequency: number;
}
