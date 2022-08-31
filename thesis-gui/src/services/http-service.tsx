import axios, { AxiosInstance } from "axios";

class HttpService {
    private static axiosInstance: AxiosInstance = axios.create({
        baseURL: 'http://127.0.0.1:8080/api'
    });

    static async get<ResponseType>(path: string) {
        return await HttpService.axiosInstance.get<ResponseType>(path);
    }

    static async post<RequestType>(path: string, body: RequestType) {
        return await HttpService.axiosInstance.post<RequestType>(path, body);
    }

    static async patch<RequestType>(path: string, body: RequestType) {
        return await HttpService.axiosInstance.patch<RequestType>(path, body);
    }}

export default HttpService;
