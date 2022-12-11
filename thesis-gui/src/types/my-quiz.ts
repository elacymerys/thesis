export type Quiz = {
    questionsSetName: string,
    questionsSetKey: string,
    numberOfQuestionsInSet: number
};

export type QuestionForm = {
    question: { value: string, errorMessage: string },
    correct: number,
    answers: { values: string[], errorMessages: string[] }
};

export type TeacherQuestionRequest = {
    question: string,
    correct: string,
    answers: string[]
}

export type QuestionsSetCreateRequest = {
    questionsSetName: string,
    teacherQuestionsRequest: TeacherQuestionRequest[]
}

export type QuestionsSetKeyResponse = {
    questionsSetKey: string
}

export type QuestionsSetKeyRequest = {
    questionsSetKey: string
}

export type TeacherQuestionResponse = {
    question: string,
    correct: string,
    answers: string[]
}

export type QuizFullResponse = {
    questionsSetName: string,
    teacherQuestionsResponse: TeacherQuestionResponse[]
};
