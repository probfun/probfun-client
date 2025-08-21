import { get } from '@/api/apiServices.ts'
import type { Chapter } from '@/types/chapter.ts'
import type { Response } from '@/types/response.ts'

export async function getChapterListApi() {
  const response = await get<Response<{
    chapterList: Chapter[]
  }>>(`/chapter`, undefined, true)
  // console.log(response.data.data)
  return response.data
}
