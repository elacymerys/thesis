import HttpService from "./http-service";
import { QuestionResponse } from "../responses/question-response";
import { AnswerRequest } from "../requests/answer-request";

class QuestionService {
    static async get(categoryId: number) {
        return await HttpService.get<QuestionResponse>(`/questions/${categoryId}`);
    }

    static async sendAnswer(body: AnswerRequest) {
        return await HttpService.post<AnswerRequest>('/answers', body);
    }
}

export default QuestionService;
