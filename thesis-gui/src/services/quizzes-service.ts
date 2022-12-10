import { httpService } from "./http-service";
import {QuestionsSetCreateRequest, QuestionsSetKeyResponse, Quiz} from "../types/my-quiz";

export const quizzesService = {
    getList() {
        return httpService.get<Quiz[]>('/questions-sets');
    },

    createNew(questionsSet: QuestionsSetCreateRequest) {
        return httpService.post<QuestionsSetCreateRequest, QuestionsSetKeyResponse>('/questions-sets', questionsSet);
    }
}
