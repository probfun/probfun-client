import { get, post } from '@/api/request.ts';

interface Subject {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
}

interface Choice {
  id: string;
  content: string;
  is_correct: boolean;
  knowledge_point: KnowledgePoint;
  created_at: string;
  updated_at: string;
  is_chosen: boolean | null;
}

interface Question {
  id: string;
  content: string;
  created_at: string;
  difficulty: string;
  full_answer: string;
  question_type: string;
  updated_at: string;
  choices: Choice[];
  answer_records: Answer[];
}

interface Answer {
  id: string;
  is_correct: boolean;
  answered_at: string;
  selected_option_ids: string[];
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

async function fetchQuestionApi(id: string) {
  const result = await get<{ question: Question }>(`/assessment/question/${id}/`);
  return result.data;
}

async function answerQuestionApi(questionId: string, selectedOptionIds: string[], subjectiveAnswer: string) {
  const result = await post<{
    question: Question;
    answer_record: Answer;
  }>(`/assessment/question/answer/`, {
    question_id: questionId,
    selected_option_ids: selectedOptionIds,
    subjective_answer: subjectiveAnswer,
  });
  return result.data;
}

async function draftQuestionApi(questionId: string, selectedOptionIds: string[]) {
  const result = await post<null>(`/assessment/question/draft`, {
    question_id: questionId,
    selected_option_ids: selectedOptionIds,
  });
  return result.data;
}

export type { Chapter, Choice, Question, Subject };

export {
  answerQuestionApi,
  draftQuestionApi,
  fetchChapterListApi,
  fetchQuestionApi,
  fetchQuestionListApi,
  fetchSubjectListApi,
};
