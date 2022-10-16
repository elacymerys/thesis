import { AdditionalInfoType } from "../types/additional-info-type";
import { CorrectType } from "../types/correct-type";

export interface QuestionResponse {
    type: number,
    question: string,
    correct: CorrectType,
    answers: string[],
    additionalInfo: AdditionalInfoType
}
