export interface PictureQuestionResponse {
    question: {
        pictureURL: string,
        authorName: string
    },
    correct: {
        id: number,
        name: string
    },
    answers: string[]
}
