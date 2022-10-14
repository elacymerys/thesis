//category id (int) -> rank (float)
export type CategoryRanks = { [key: number]: number };

export type User = {
    id: number,
    nick: string,
    email: string,
    categoryRanks: CategoryRanks
};
