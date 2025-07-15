import type { Experiment } from '@/api/experiment/experimentType';
import { get, post } from '@/api/request.ts';

export async function fetchFavoriteExperimentsApi() {
  const result = await get<{
    experiments: Experiment[];
  }>(`/experiment/favorite/`);
  return result.data;
}

export async function toggleFavoriteApi(expId: string) {
  const result = await post<{
    isFavorite: boolean;
  }>(`/experiment/${expId}/favorite/`);
  return result.data;
}
