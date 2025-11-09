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
  chapters: ChapterOverview[];
  studentPerformance: StudentPerformance[];
  activityDistribution: ActivityDistributionEntry[];
}

export interface ChapterOverview {
  chapterId: string;
  chapterName: string;
  averageAccuracy: number;
  averageAttempts: number;
  totalAttempts: number;
  studentCount: number;
  completionRate: number;
  children?: ChapterOverview[];
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  completedQuestions: number;
  accuracy: number;
  studyDuration: number;
  chapters: ChapterOverview[];
}

export interface ActivityDistributionEntry {
  studentId: string;
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
  studentId: string;
  studentName: string;
  learningTrajectory: LearningTrajectoryEntry[];
  chapters: ChapterDetailEntry[];
}

export interface LearningTrajectoryEntry {
  date: string;
  completedQuestions: number;
  accuracy: number;
  totalAttempts: number;
}

export interface ChapterDetailEntry {
  chapterId: string;
  chapterName: string;
  accuracy: number;
  averageAttempts: number;
  totalAttempts: number;
}

export interface Insights {
  frequentMistakes: FrequentMistake[];
  chatKeywords: {
    subjectName: string;
    totalCount: number;
    keywords: ChatKeyword[];
  }[];
}

export interface FrequentMistake {
  questionId: string;
  questionContent: string;
  chapter: string;
  mistakeCount: number;
  studentCount: number;
}

export interface ChatKeyword {
  keyword: string;
  frequency: number;
}
