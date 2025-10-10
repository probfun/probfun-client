import type {
  Edge,
  Node,
} from '@vue-flow/core';
import { del, get, post } from '@/api/request.ts';
import { getAuthToken } from '@/utils/auth';
import { connect } from '@/utils/sse';

interface Subject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Chapter {
  id: string;
  name: string;
  description: string;
  children: {
    id: number;
    name: string;
    description: string;
    children: Chapter[];
  }[];
  config: Record<string, any>;
}

interface KnowledgePoint {
  id: string;
  name: string;
  description: string;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
}

interface Choice {
  id: string;
  content: string;
  isCorrect: boolean;
  knowledgePoint: KnowledgePoint;
  createdAt: string;
  updatedAt: string;
  isChosen: boolean | null;
}

export interface Chat {
  id: string;
  role: string;
  content: string;
  createdAt: string;
  status: string;
  hasReceivedText?: boolean;
  isUsingTool?: boolean;
}

interface Question {
  id: string;
  content: string;
  created_at: string;
  difficulty: string;
  fullAnswer: string;
  questionType: string;
  updatedAt: string;
  choices: Choice[];
  answerRecords: Answer[];
  chats: Chat[] | null;
}

interface Answer {
  id: string;
  isCorrect: boolean;
  answeredAt: string;
  selectedOptionIds: string[];
}

interface AnalysisMetric {
  name: string;
  value: number;
  explanation: string;
}

interface AnalysisInsight {
  title: string;
  summary: string;
  evidence: string[];
  tags: string[];
}

interface ObjectiveAnalysis {
  metrics: AnalysisMetric[];
  insights: AnalysisInsight[];
  milestones: string[];
}

interface DialogueAnalysis {
  metrics: AnalysisMetric[];
  insights: AnalysisInsight[];
  representativeDialogues: string[];
}

interface LearningAnalysis {
  profileLabel: string;
  metrics: AnalysisMetric[];
  insights: AnalysisInsight[];
  samplePaths: string[][];
}

interface CognitiveAnalysis {
  thinkingStyles: string[];
  metrics: AnalysisMetric[];
  insights: AnalysisInsight[];
}

interface StudyPlan {
  weaknesses: string[];
  styleAdaptation: string;
  personalizedRecommendations: {
    title: string;
    description: string;
    actionType: string;
    targetKnowledge: string;
    triggerReason: string;
  }[];
  overallStrategy: string;
}

interface ChapterSummary {
  chapter: {
    id: string;
    name: string;
    description: string;
  };
  completedCount: number;
  correctCount: number;
  accuracy: number;
  questionCompletionRate: number;
}

export interface Analysis {
  objectiveAnalysis: ObjectiveAnalysis;
  dialogueAnalysis: DialogueAnalysis;
  learningAnalysis: LearningAnalysis;
  cognitiveAnalysis: CognitiveAnalysis;
  studyPlan: StudyPlan;
  chapterSummary: ChapterSummary[];
}

async function fetchSubjectListApi() {
  const result = await get<{
    subjects: Subject[];
  }>(`/assessment/subject/list/`);
  return result.data;
}

async function fetchQuestionListApi(chapterId: string) {
  const result = await get<{
    questions: Question[];
  }>(`/assessment/question/list/`, { chapterId });
  return result.data;
}

async function fetchChapterListApi(subjectId: string) {
  const result = await get<{
    chapters: Chapter[];
  }>(`/assessment/chapter/list/`, { subjectId });
  return result.data;
}

async function fetchQuestionChatsApi(id: string) {
  const result = await get<{ conversation: {
    id: string;
    messages: Chat[];
    createdAt: string;
    updatedAt: string;
  }; }>(`/assessment/question/chat/${id}/`);
  return result.data;
}

async function answerQuestionApi(questionId: string, selectedOptionIds: string[], subjectiveAnswer: string) {
  const result = await post<{
    question: Question;
    answerRecord: Answer;
  }>(`/assessment/question/answer/`, {
    questionId,
    selectedOptionIds,
    subjectiveAnswer,
  });
  return result.data;
}

async function draftQuestionApi(questionId: string, selectedOptionIds: string[]) {
  const result = await post<null>(`/assessment/question/draft/`, {
    questionId,
    selectedOptionIds,
  });
  return result.data;
}

async function clearQuestionChatApi(questionId: string) {
  const result = await del<null>(`/assessment/question/chat/${questionId}/`);
  return result.data;
}

async function chatWithAiAPi(
  questionId: string,
  content: string,
  onopen: (response: Response) => Promise<void>,
  onmessage: (data: any) => void,
  onclose: () => void,
  onerror: (ev: Event) => void,
  controller: AbortController,
) {
  await connect({
    url: '/assessment/question/chat/',
    method: 'POST',
    body: {
      questionId,
      content,
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': getAuthToken(),
    },
    controller,
    onopen,
    onmessage: (ev) => {
      try {
        const data = JSON.parse(ev.data);
        onmessage(data);
      }
      catch (e) {
        console.error('Error parsing SSE message:', e);
      }
    },
    onclose,
    onerror,
  });
}

async function fetchDiagramApi(chapterId: string) {
  const result = await get<{
    edges: Edge[];
    nodes: Node[];
  }>(`/assessment/chapter/knowledge-graph/`, { chapterId });
  return result.data;
}

async function analysisApi(subjectId: string) {
  const result = await post<{
    analysis?: Analysis;
    status: string;
  }>(`/assessment/analysis/`, { subjectId });
  return result.data;
}

export type {
  Chapter,
  Choice,
  CognitiveAnalysis,
  DialogueAnalysis,
  LearningAnalysis,
  ObjectiveAnalysis,
  Question,
  StudyPlan,
  Subject,
};

export {
  analysisApi,
  answerQuestionApi,
  chatWithAiAPi,
  clearQuestionChatApi,
  draftQuestionApi,
  fetchChapterListApi,
  fetchDiagramApi,
  fetchQuestionChatsApi,
  fetchQuestionListApi,
  fetchSubjectListApi,
};
