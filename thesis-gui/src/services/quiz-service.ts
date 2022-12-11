import { httpService } from "./http-service";
import {
    QuestionsSetRequest,
    QuestionsSetKeyRequest,
    QuestionsSetKeyResponse,
    Quiz,
    QuestionsSetResponse
} from "../types/my-quiz";

export const quizService = {
    get(key: string): Promise<QuestionsSetRequest> {
        return httpService.get<QuestionsSetRequest>(`/questions-sets/${key}`);
    },

    getList() {
        return httpService.get<Quiz[]>('/questions-sets');
    },

    createNew(questionsSet: QuestionsSetRequest) {
        return httpService.post<QuestionsSetRequest, QuestionsSetKeyResponse>('/questions-sets', questionsSet);
    },

    getQuiz(key: string) {
        return httpService.get<QuestionsSetResponse>(`/questions-sets/${key}`);
    },

    update(key: string, questionsSet: QuestionsSetRequest) {
        return httpService.put<QuestionsSetRequest, QuestionsSetKeyResponse>(`/questions-sets/${key}`, questionsSet);
    },

    delete(key: string) {
        return httpService.delete<undefined, undefined>(`/questions-sets/${key}`, undefined);
    },

    refreshKey(key: QuestionsSetKeyRequest) {
        return httpService.patch<QuestionsSetKeyRequest, QuestionsSetKeyResponse>('/questions-sets/refresh-key', key);
    }
}
