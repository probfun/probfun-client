import { get } from '@/api/request'
import { Mydata } from '../classType';

export async function fetchMydataApi(classId: string) {
  const result = await get<{
    mydata: Mydata
  }>(`/api/classes/${classId}/comments`)
  return result.data;
}