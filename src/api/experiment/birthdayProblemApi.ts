import type { BirthdayProblem } from './birthdayProblemType';
import { post } from '../request';

export async function birthdayProblemApi(people: number, runs: number, monthProbs: number[], needNProb: boolean) {
  const result = await post<BirthdayProblem>('/api/experiment/birthdayProblem', {
    people,
    runs,
    monthProbs,
    needNProb,
  });
  return result.data;
}
