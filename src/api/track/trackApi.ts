import type { Track } from './trackType';
import { useUserStore } from '@/store';
import { post } from '../request';

export async function clickApi(actionType: string, entityType: string, entityName: string, pageName: string) {
  const user = useUserStore().user;
  if (user?.role === -1) {
    return;
  }
  const result = await post<{ track: Track }>('/track/click/', {
    actionType,
    entityType,
    entityName,
    pageName,
  });
  return result.data;
}

export async function browseApi(actionType: string, pageName: string) {
  const user = useUserStore().user;
  if (user?.role === -1) {
    return;
  }
  const result = await post<{ track: Track }>('/track/page/', {
    actionType,
    pageName,
  });
  return result.data;
}

export async function visitorApi() {
  const result = await post<{
    ok: boolean;
  }>('/track/guest/');
  return result.data;
}
