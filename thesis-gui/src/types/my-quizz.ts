export type Question = {
    question: string
    correct: string
    answers: string[]
};

export type QuestionsSet = {
    questionsSetName: string
    teacherQuestionsRequest: Question
};

export type QuestionValidation = {
    questionError: string
    correctError: string
    answersError: string[]
}

export type QuestionForm = {
    question: { value: string, errorMessage: string },
    correct: number,
    answers: { values: string[], errorMessages: string[] }
};
