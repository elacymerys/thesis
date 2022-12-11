import { httpService } from "./http-service";
import {QuestionsSetCreateRequest, QuestionsSetKeyResponse, Quiz} from "../types/my-quiz";

export const quizService = {
    get(key: string): Promise<QuestionsSetCreateRequest> {
        return httpService.get<QuestionsSetCreateRequest>(`/questions-sets/${key}`);
    },

    getList() {
        return httpService.get<Quiz[]>('/questions-sets');
    },

    createNew(questionsSet: QuestionsSetCreateRequest) {
        return httpService.post<QuestionsSetCreateRequest, QuestionsSetKeyResponse>('/questions-sets', questionsSet);
    }
}
