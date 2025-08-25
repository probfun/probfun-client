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
  difficulty: '简单' | '中等' | '困难';
  chapter: string;
  chapter_id: number;
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

export type { Chapter, Question, Subject};

export {
  fetchChapterListApi,
  fetchQuestionListApi,
  fetchSubjectListApi,
};
