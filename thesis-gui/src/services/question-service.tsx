import { httpService } from "./http-service";
import {questionTypeService} from "./question-type-service";
import { QuestionType } from "../utils/question-type";
import {AnswerRequest} from "../types/term-difficulty-update-request";
import {QuestionResponse} from "../types/question-response";

export const questionService = {
    get(categoryId: number) {
        const questionType = questionTypeService.getRandom();
        if (questionType === QuestionType.DEFINITION) {
            return definitionQuestionService.get(categoryId);
        } else {
            return pictureQuestionService.get(categoryId);
        }
    },

    sendAnswer(body: AnswerRequest) {
        return httpService.post<AnswerRequest, any>('/answers', body);
    }
}

const definitionQuestionService = {
    get(categoryId: number) {
        return httpService.get<QuestionResponse>(`/categories/${categoryId}/definition/random`);
    }
}

const pictureQuestionService = {
    get(categoryId: number) {
        return httpService.get<QuestionResponse>(`/categories/${categoryId}/picture/random`);
    }
}
