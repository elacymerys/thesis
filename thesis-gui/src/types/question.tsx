export type Question = {
    question: string,
    correct: {
        id: number,
        name: string
    },
    answers: string[]
};
