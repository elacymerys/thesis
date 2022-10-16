export interface QuestionResponse {
    type: number,
    question: string,
    correct: {
        id: number,
        name: string
    },
    answers: string[],
    additionalInfo: {
        authorName: string
    }
}
