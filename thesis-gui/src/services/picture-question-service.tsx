import HttpService from "./http-service";
import { PictureQuestionResponse } from "../responses/picture-question-response";
import {TermDifficultyUpdateRequest} from "../requests/term-difficulty-update-request";

class PictureQuestionService {
    static async get(categoryId: number) {
        return await HttpService.get<PictureQuestionResponse>(`/categories/${categoryId}/picture/random`);
    }

    static async sendAnswer(termId: number, body: TermDifficultyUpdateRequest) {
        return await HttpService.patch<TermDifficultyUpdateRequest>(`/terms/${termId}`, body);
    }
}

export default PictureQuestionService;
