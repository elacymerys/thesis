export type QuestionForm = {
    question: { value: string, errorMessage: string },
    correct: number,
    answers: { values: string[], errorMessages: string[] }
};
