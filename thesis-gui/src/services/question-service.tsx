import HttpService from "./http-service";
import { QuestionResponse } from "../responses/question-response";

class QuestionService {
    static async get(categoryId: number) {
        return await HttpService.get<QuestionResponse>(`/questions/${categoryId}`);
    }
}

export default QuestionService;
