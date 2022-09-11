import HttpService from "./http-service";
import { QuestionResponse } from "../responses/question-response";
import {TermDifficultyUpdateRequest} from "../requests/term-difficulty-update-request";

class QuestionService {
    static async get(categoryId: number) {
        return await HttpService.get<QuestionResponse>(`/categories/${categoryId}/questions`);
    }

    static async sendAnswer(termId: number, body: TermDifficultyUpdateRequest) {
        return await HttpService.patch<TermDifficultyUpdateRequest>(`/terms/${termId}`, body);
    }
}

export default QuestionService;
