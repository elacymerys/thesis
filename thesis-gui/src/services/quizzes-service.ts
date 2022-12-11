import { httpService } from "./http-service";
import {
    QuestionsSetCreateRequest,
    QuestionsSetKeyRequest,
    QuestionsSetKeyResponse,
    Quiz,
    QuizFullResponse
} from "../types/my-quiz";

export const quizzesService = {
    getList() {
        return httpService.get<Quiz[]>('/questions-sets');
    },

    createNew(questionsSet: QuestionsSetCreateRequest) {
        return httpService.post<QuestionsSetCreateRequest, QuestionsSetKeyResponse>('/questions-sets', questionsSet);
    },

    getQuiz(key: string) {
        return httpService.get<QuizFullResponse>(`/questions-sets/${key}`);
    },

    update(key: string, questionsSet: QuestionsSetCreateRequest) {
        return httpService.put<QuestionsSetCreateRequest, QuestionsSetKeyResponse>(`/questions-sets/${key}`, questionsSet);
    },

    delete(key: string) {
        return httpService.delete<undefined, QuestionsSetKeyResponse>(`/questions-sets/${key}`, undefined);
    },

    refreshKey(key: QuestionsSetKeyRequest) {
        return httpService.patch<QuestionsSetKeyRequest, QuestionsSetKeyResponse>('/questions-sets/refresh-key', key);
    }
}
