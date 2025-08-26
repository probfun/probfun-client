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
  chapter: {
    id: number;
    name: string;
    parentId: number;
    subject: string;
  };
}

interface Option {
  id: number;
  content: string;
  is_correct: boolean;
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

async function fetchChoiceOptionApi(questionId: number) {
  const result = await get<{
    options: Option[];
  }>(`/assessment/choiceoption/list/`, { questionId });
  return result.data;
}

export type { Chapter, Question, Subject, Option };

export {
  fetchChapterListApi,
  fetchQuestionListApi,
  fetchSubjectListApi,
  fetchChoiceOptionApi,
};
