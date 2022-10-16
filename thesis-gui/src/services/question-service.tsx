import HttpService from "./http-service";
import { QuestionResponse } from "../responses/question-response";
import { TermDifficultyUpdateRequest } from "../requests/term-difficulty-update-request";
import QuestionTypeService from "./question-type-service";
import { QuestionType } from "../utils/question-type";


class QuestionService {
    static async get(categoryId: number) {
        let questionType = QuestionTypeService.getRandom();
        if (questionType == QuestionType.DEFINITION) {
            return await DefinitionQuestionService.get(categoryId);
        } else {
            return await PictureQuestionService.get(categoryId);
        }
    }

    static async sendAnswer(termId: number, body: TermDifficultyUpdateRequest) {
        return await HttpService.patch<TermDifficultyUpdateRequest>(`/terms/${termId}`, body);
    }
}

class DefinitionQuestionService {
    static async get(categoryId: number) {
        return await HttpService.get<QuestionResponse>(`/categories/${categoryId}/definition/random`);
    }
}

class PictureQuestionService {
    static async get(categoryId: number) {
        return await HttpService.get<QuestionResponse>(`/categories/${categoryId}/picture/random`);
    }
}

export default QuestionService;
