import type {
  Edge,
  Node,
} from '@vue-flow/core';
import { del, get, post } from '@/api/request.ts';

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

interface Chat {
  id: string;
  role: string;
  content: string;
  createdAt: string;
  status: string;
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

async function fetchSubjectListApi() {
  const result = await get(`/assessment/subject/list/`);
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

async function chatWithAiAPi(questionId: string, content: string) {
  // return new Promise<{
  //   chats: Chat[];
  // }>(resolve => setTimeout(() => resolve({
  //   chats: [
  //     {
  //       id: '0',
  //       role: 'user',
  //       content,
  //       createdAt: '0',
  //     },
  //     {
  //       id: '1',
  //       role: 'ai',
  //       content: '我不知道',
  //       createdAt: '0',
  //     },
  //   ],
  // }), 5000));
  const result = await post<{
    userMessage: Chat;
    aiMessage: Chat;
  }>(`/assessment/question/chat/`, {
    questionId,
    content,
  }, {
    timeout: 50000,
  });
  return result.data;
}

async function fetchDiagramApi(chapterId: string) {
  const result = await get<{
    edges: Edge[];
    nodes: Node[];
  }>(`/assessment/chapter/knowledge-graph/`, { chapterId });
  return result.data;
}

export type { Chapter, Choice, Question, Subject };

export {
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
