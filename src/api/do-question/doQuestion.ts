import { get } from '@/api/request.ts';

interface Subject {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Chapter {
  id: number;
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

interface Question {
  id: number;
  content: string;
  difficulty: number;
  full_answer: string;
  chapter: {
    id: number;
    name: string;
    parentId: number;
    subject: string;
  };
}

interface Detail {
  question: {
    id: number;
    content: string;
    choices: {
      id: number;
      content: string;
      is_correct: boolean;
      knowledge_points: {
        id: number;
        name: string;
      }
    };
    difficulty: number;
    full_answer: string;
  };
}

async function fetchSubjectListApi() {
  const result = await get(`/assessment/subject/list/`);
  return result.data;
}

async function fetchChapterListApi(subjectId: number) {
  const result = await get<{
    chapters: Chapter[];
  }>(`/assessment/chapter/list/`, { subjectId });
  return result.data;
}

async function fetchQuestionListApi(chapterId: number) {
  const result = await get<{
    questions: Question[];
  }>(`/assessment/question/list/`, { chapterId });
  return result.data;
}

async function fetchQuestionDetailApi(questionId: number) {
  const result = await get<Detail>(`/assessment/question/${questionId}`);
  return result.data;
}

export type { Chapter, Question, Subject, Detail };

export {
  fetchChapterListApi,
  fetchQuestionListApi,
  fetchSubjectListApi,
  fetchQuestionDetailApi
};
