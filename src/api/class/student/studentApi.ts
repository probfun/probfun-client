import type { Mydata } from '../classType';
import { get } from '@/api/request';

export async function fetchMydataApi(classId: string) {
  const result = await get<{
    mydata: Mydata;
  }>(`/api/classes/${classId}/comments`);
  return result.data;
}
