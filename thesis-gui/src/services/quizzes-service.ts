import { httpService } from "./http-service";
import { QuizzesList } from "../types/quizzes-list";
import { QuestionsSetKeyRequest } from "../types/questions-set-key-request";
import { QuestionsSetKeyResponse } from "../types/questions-set-key-response";

export const quizzesService = {
    getList() {
        return httpService.get<QuizzesList>('/questions-sets');
    },

    refreshQuestionSetKey(body: QuestionsSetKeyRequest) {
        return httpService.patch<QuestionsSetKeyRequest, QuestionsSetKeyResponse>('/questions-sets/refresh-key', body);
    },

    deleteQuestionSet(body: QuestionsSetKeyRequest) {
        return httpService.delete<QuestionsSetKeyRequest, undefined>('/questions-sets', body);
    }
}
