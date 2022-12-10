import { httpService } from "./http-service";
import { Quiz } from "../types/my-quiz";

export const quizzesService = {
    getList() {
        return httpService.get<Quiz[]>('/questions-sets');
    }
}
