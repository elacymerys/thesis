import HttpService from "./http-service";
import { CategoryResponse } from "../responses/category-response";

class CategoryService {
    static async getAll() {
        return await HttpService.get<CategoryResponse[]>('/categories');
    }
}

export default CategoryService;
