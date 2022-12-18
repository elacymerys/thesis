//category id (int) -> rank (float)
export type CategoryRanks = { [key: number]: number };

//category id (int) -> total answers (long)
export type CategoryTotalAnswersCounter = { [key: number]: number };

export type User = {
    id: number,
    nick: string,
    email: string,
    categoryRanks: CategoryRanks,
    categoryTotalAnswersCounter: CategoryTotalAnswersCounter
};
