import type { Experiment } from '@/api/experiment/experimentType';

export interface Response {
    classExperimentData: ClassExperimentData;
    personalExperimentData: PersonalExperimentData;
    commentCount: number;
    likeCount: number;
    pinCount: string;
    replyCount: number;
    [property: string]: any;
}

export interface ClassExperimentData {
    mostClick: Experiment;
    mostComment: Experiment;
    mostFavorite: Experiment;
    mostTime: Experiment;
    [property: string]: any;
}

export interface PersonalExperimentData {
    mostClick: Experiment;
    mostTime: Experiment;
    [property: string]: any;
}
