import type { ChatMessage, ReceiveData } from '@/api/ai/aiType';
import { getAuthToken } from '@/utils/auth';
import { connect } from '@/utils/sse';
import { error } from '@/utils/toast';
import { get, post, postRaw } from '../request';

interface ChatRequest extends Record<string, unknown> {
  messages: ChatMessage[];
  conversationId?: string;
}

async function aiApi(
  requestData: ChatRequest,
  open: () => void,
  receive: (data: ReceiveData) => void,
  finish: () => void,
  abortController: AbortController | null = null,
) {
  const controller = abortController || new AbortController();
  try {
    await connect({
      url: '/langchain/chat/',
      method: 'POST',
      body: requestData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': getAuthToken(),
      },
      controller,
      onopen: async (_response) => {
        console.log('SSE connection established');
        open();
      },
      onmessage: (ev) => {
        const data = JSON.parse(ev.data);
        receive(data);
      },
      onclose: () => {
        console.log('SSE connection closed');
        finish();
      },
      onerror: (ev) => {
        console.error('SSE error:', ev);
        error('连接发生错误');
        finish();
      },
    });
  }
  catch (e) {
    error('连接发生错误');
    console.error('Error during SSE connection:', e);
    finish();
  }
}

async function generateTitleApi(messages: ChatMessage[]) {
  return await postRaw<{
    title: string;
  }>('/ai/title', { messages });
}

async function generateDistributionFunctionApi(distribution: string) {
  return await postRaw<{
    function: string;
    latex: string;
    min: number;
    max: number;
  }>('/ai/distribution_function', { distribution }, {
    timeout: 20000,
  });
}

async function fetchQuestionsApi() {
  const result = await get<{
    questions: string[];
  }>(`/langchain/questions/`);
  return result.data;
}

async function fetchWordCloudApi() {
  const result = await post<{
    wordsData: {
      words: string[];
      total_words: number;
      frequencies: number[];
    }[];
    wordCount: number;
    imageUrl: string;
    id: string;
  }>(`/langchain/wordcloud/`);
  return result.data;
}

// export async function getConversationApi(conversationId: string) {
//   return await get<{
//     conversation: {
//       messages: ChatMessage[];
//     };
//   }>(`/langchain/conversation/${conversationId}/`);
// }

export {
  aiApi,
  fetchQuestionsApi,
  fetchWordCloudApi,
  generateDistributionFunctionApi,
  generateTitleApi,
};
