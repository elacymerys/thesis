import {HttpStatusCode} from "../utils/http-status-code";

export const httpService = {
    request(path: string, method: string, body?: any) {
        return fetch(
            `/api/${path}`,
            {
                method: method,
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                credentials: 'include',
                body: body && JSON.stringify(body)
            }
        ).then(res => {
            if (res.ok) {
                return res.status === HttpStatusCode.NO_CONTENT ? undefined : res.json();
            } else {
                return Promise.reject({ apiStatusCode: res.status });
            }
        });
    },

    get<ResponseType>(path: string): Promise<ResponseType> {
        return this.request(path, 'GET');
    },

    post<RequestType, ResponseType>(path: string, body: RequestType): Promise<ResponseType> {
        return this.request(path, 'POST', body);
    },

    patch<RequestType, ResponseType>(path: string, body: RequestType): Promise<ResponseType> {
        return this.request(path, 'PATCH', body);
    },

    delete<RequestType, ResponseType>(path: string, body: RequestType): Promise<ResponseType> {
        return this.request(path, 'DELETE', body);
    },

    put<RequestType, ResponseType>(path: string, body: RequestType): Promise<ResponseType> {
        return this.request(path, 'PUT', body);
    }
};
