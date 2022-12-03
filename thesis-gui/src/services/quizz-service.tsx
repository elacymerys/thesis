import { TeacherQuestionSet } from "../types/teacher-question-set";
import {httpService} from "./http-service";

export const quizzService = {
    get(key:string): Promise<TeacherQuestionSet> {
        return httpService.get<TeacherQuestionSet>(`/questions-sets/${key}`);
    }
};
