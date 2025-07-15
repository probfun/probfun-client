import type { Feedback } from './feedbackType';
import { get, post } from '../request';

export async function fetchFeedbackApi() {
  const result = await get<{ feedback: Feedback[] }>('/feedback/', {});
  return result.data;
}

export async function postFeedbackApi(category: string, content: string) {
  const result = await post<{ feedback: Feedback }>('/feedback/', {
    category,
    content,
  });
  return result.data;
}
