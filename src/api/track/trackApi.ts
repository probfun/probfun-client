import { post } from "../request";
import { Track } from "./trackType";

export async function clickApi(actionType: string, entityType: string, entityName: string, pageName: string) {
    const result = await post<{ track: Track }>('/api/track/click', {
        actionType,
        entityType,
        entityName,
        pageName
    })
    return result.data;
}

export async function browseApi(actionType: string, pageName: string) {
    const result = await post<{ track: Track }>('/api/track/page', {
        actionType,
        pageName
    });
    return result.data;
}