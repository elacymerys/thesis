import { Question } from "../types/question";
import {TermDifficultyUpdateRequest} from "../types/term-difficulty-update-request";
import {httpService} from "./http-service";

export const questionService = {
    get(categoryId: number) {
        return httpService.get<Question>(`categories/${categoryId}/questions`);
    },

    sendAnswer(termId: number, body: TermDifficultyUpdateRequest) {
        return httpService.patch<TermDifficultyUpdateRequest, any>(`terms/${termId}`, body);
    }
};
