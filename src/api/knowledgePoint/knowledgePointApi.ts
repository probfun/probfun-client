import type { Response } from '@/types/response.ts'
import { get } from '@/api/apiServices.ts'

export async function getChapterKnowledgePointApi(chapterId: string) {
  const response = await get<Response<{
    chapter: {
      id: string
      name: string
    }
    knowledgePoints: {
      knowledgePointId: string
      content: string
      description?: string
    }[]
  }>>('/question/chapter/knowledge', { chapterId }, true)
  return response.data
}

export async function getChapterSectionKnowledgePointApi(chapterId: string) {
  const response = await get<Response<{
    chapter: {
      id: string
      name: string
    }
    knowledgePoints: {
      knowledgePointId: string
      content: string
      description?: string
    }[]
  }>>('/chapter/section/knowledge', { chapterId }, true)
  return response.data
}

export async function getChapterKnowledgeMasteryApi(chapterId: string) {
  const response = await get <Response<{
    masteredList: {
      kpId: string
      content: string
      description?: string
      masteredRate: number
    }[]
  }>>('/question/chapter/knowledge/mastered', { chapterId }, true)
  // console.log(response)
  return response.data
}
