import { QuestionType } from "../utils/question-type";

class QuestionTypeService {
    static getRandom() {
        return Math.floor(Math.random() * (Object.keys(QuestionType).length / 2));
    }
}

export default QuestionTypeService;
