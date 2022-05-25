import axios, { AxiosInstance } from "axios";

class HttpService {
    private static axiosInstance: AxiosInstance = axios.create({
        baseURL: 'http://127.0.0.1:8000/api'
    });

    static async get<ResponseType>(url: string){
        return await HttpService.axiosInstance.get<ResponseType>(url)
    }
}

export default HttpService;
