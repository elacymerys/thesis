import axios, {AxiosInstance} from "axios";

class Api{
    private static axiosInstance: AxiosInstance;

    static init(){
        this.axiosInstance = axios.create({
            baseURL: 'http://127.0.0.1:8000'
        })
    }

    static async get<ResponseType>(url: string){
        return await Api.axiosInstance.get<ResponseType>(url)
    }
}

export default Api;