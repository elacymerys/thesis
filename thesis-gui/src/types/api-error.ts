export type ApiError = {
    apiStatusCode: number
};

export const isApiError = (err: any) => (err as ApiError).apiStatusCode !== undefined;
