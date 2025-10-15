import { get } from '@/api/request.ts';

interface Mathematician {
  id: string;
  fullName: string;
  birthDate: string;
  birthPlace: string;
  deathDate?: string;
  deathPlace?: string;
  summary: string;
  biography: string;
  portraits: string;
  createAt: string;
  updateAt: string;
}

async function fetchMathematicianList() {
  const result = await get<{
    mathematicians: Mathematician[];
  }>(`/trand/mathematician/list/`);
  return result.data;
}

export type {
  Mathematician,
};

export {
  fetchMathematicianList,
};
