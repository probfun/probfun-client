import type { Comment } from '@/api/comment/commentType'
import { get } from '@/api/request'

export async function fetchCommentsApi(classId: string, period: 'CURRENT_TERM' | 'LAST_MONTH' | 'ALL_TIME') {
    const result = await get<{
        comments: Comment[]
    }>(`/api/classes/${classId}/comments`, { period })
    return result.data;
}