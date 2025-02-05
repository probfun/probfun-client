import { postRaw } from '@/api/request.ts';

export async function generateDistributionDescriptionApi(distribution: string, subject: string = 'default') {
  return await postRaw<{
    description: string
  }>(`/ai/distribution_description`, {
    distribution,
    subject,
  }, {
    timeout: 20000,
  });
}
