import { CorrectType } from "./correct-type";

export interface QuestionResponse {
    type: number,
    question: string,
    correct: CorrectType,
    answers: string[],
    authorName: string
}
