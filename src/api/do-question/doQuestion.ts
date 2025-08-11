import { get } from '@/api/request.ts';

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
}

async function fetchQuestionListApi(subject: string | null) {
  const result = await get<{
    chapters: Chapter[];
  }>(`/assessment/chapter/list/`, { subject });
  return result.data;
}
//
// export async function fetchChapterList(expId: string) {
//   const result = await post<{
//     isFavorite: boolean;
//   }>(`/experiment/${expId}/favorite/`);
//   return result.data;
// }

export type { Chapter };

export {
  fetchQuestionListApi,
};
