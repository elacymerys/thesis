export interface QuestionResponse {
    question: string,
    correct: {
        id: number,
        name: string
    },
    answers: string[]
}
