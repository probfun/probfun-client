import { get } from '@/api/apiServices'
import type { MindMapData } from '@/types/mindmap.ts'
import type { Response } from '@/types/response.ts'

export async function getMindMapApi(chapterId: string) {
  const response = await get<Response<MindMapData>>('/chapter/mind/map', { chapterId }, true)
  return response.data
}
