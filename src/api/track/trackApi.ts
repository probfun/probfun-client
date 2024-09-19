import { post } from "../request";
import { Track } from "./trackType";

export async function clickApi(id: string, actionType: string, entityType: string, entityName: string, pageName: string) {
    const result = await post<{ track: Track }>('/api/track/click', {
        id,
        actionType,
        entityType,
        entityName,
        pageName
    })
    return result.data;
}

export async function browseApi(id: string, actionType: string, pageName: string) {
    const result = await post<{ track: Track }>('/api/track/click', {
        id,
        actionType,
        pageName
    });
    return result.data;
}