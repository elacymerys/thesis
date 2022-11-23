import { httpService } from "./http-service";
import { QuizzesList } from "../types/quizzes-list";

export const quizzesService = {
    getList() {
        return httpService.get<QuizzesList>('/questions-sets');
    }
}
