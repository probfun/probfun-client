import { post } from "../request";
import type { BirthdayProblem } from "./birthdayProblemType";

export async function birthdayProblemApi(people: number, runs: number, monthProbs: number[], needNProb: boolean) {
    const result = await post<{ birthdayProblem: BirthdayProblem }>('/api/experiment/birthdayProblem', {
        people,
        runs,
        monthProbs,
        needNProb
    })
    return result.data
}