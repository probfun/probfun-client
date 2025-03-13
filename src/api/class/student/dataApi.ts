import type { Experiment } from '@/api/experiment/experimentType';
import type { Feedback } from '@/api/feedback/feedbackType';
import { get, post } from '@/api/request.ts';
import {Response} from './dataType'

/**
 * 获取实验相关数据
 */
export async function fetchExperimentData(): Promise<Response> {
  const result = await get<Response>(`/api/experiments/data`);
  return result.data;
}

/**
 * 获取最受欢迎的实验（最多收藏）
 */
export async function fetchFavoriteExperiments(): Promise<Experiment[]> {
  const result = await get<{ experiments: Experiment[] }>(`/api/experiments/favorite`);
  return result.data.experiments;
}

/**
 * 切换实验收藏状态
 * @param expId 实验 ID
 */
export async function toggleFavoriteExperiment(expId: string): Promise<boolean> {
  const result = await post<{ isFavorite: boolean }>(`/api/experiments/${expId}/favorite`);
  return result.data.isFavorite;
}

/**
 * 提取班级实验数据中的重要实验信息
 */
export function extractClassTopExperiments(classData: Response['classExperimentData']): Experiment[] {
  return [
    classData.mostClick,
    classData.mostComment,
    classData.mostFavorite,
    classData.mostTime,
  ].filter(Boolean);
}

/**
 * 提取个人实验数据中的重要实验信息
 */
export function extractPersonalTopExperiments(personalData: Response['personalExperimentData']): Experiment[] {
  return [
    personalData.mostClick,
    personalData.mostTime,
  ].filter(Boolean);
}

/**
 * 获取实验的用户反馈
 * @param expId 实验 ID
 */
export async function fetchExperimentFeedback(expId: string): Promise<Feedback[]> {
  const result = await get<{ feedbacks: Feedback[] }>(`/api/experiments/${expId}/feedback`);
  return result.data.feedbacks;
}
