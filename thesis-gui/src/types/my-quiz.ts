export type Quiz = {
    questionsSetName: string,
    questionsSetKey: string,
    numberOfQuestionsInSet: number
}

export type QuestionForm = {
    question: { value: string, errorMessage: string },
    correct: number,
    answers: { values: string[], errorMessages: string[] }
}

export type TeacherQuestionRequest = {
    question: string,
    correct: string,
    answers: string[]
}

export type TeacherQuestionResponse = {
    question: string,
    correct: string,
    answers: string[]
}

export type QuestionsSetRequest = {
    questionsSetName: string,
    teacherQuestionsRequest: TeacherQuestionRequest[]
}

export type QuestionsSetResponse = {
    questionsSetName: string,
    teacherQuestionsResponse: TeacherQuestionResponse[]
}

export type QuestionsSetKeyRequest = {
    questionsSetKey: string
}

export type QuestionsSetKeyResponse = {
    questionsSetKey: string
}
