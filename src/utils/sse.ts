import type { EventSourceMessage } from '@microsoft/fetch-event-source';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const BASE_URL = '/backend-api';

export async function connect(data: {
  url: string;
  body?: Record<string, unknown>;
  onopen: (response: Response) => Promise<void>;
  onmessage: (ev: EventSourceMessage) => void;
  onclose: () => void;
  onerror: (ev: Event) => void;
  controller: AbortController;
  method: string;
  headers?: Record<string, string>;
}) {
  await fetchEventSource(`${BASE_URL}${data.url}`, {
    ...data,
    body: JSON.stringify(data.body),
    signal: data.controller.signal,
  });
}
