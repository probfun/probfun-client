import { postRaw } from '@/api/request.ts';

export async function generateDistributionDescriptionApi(distribution: string) {
  return await postRaw<{
    description: string
  }>(`/ai/distribution_description`, {
    distribution,
  }, {
    timeout: 20000,
  });
}
