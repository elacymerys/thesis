import { QuestionType } from "../utils/question-type";

export const questionTypeService = {
    getRandom() {
        return Math.floor(Math.random() * (Object.keys(QuestionType).length / 2));
    }
}
