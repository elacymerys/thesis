import { Category } from "../types/category";
import {httpService} from "./http-service";

export const categoryService = {
    getAll(): Promise<Category[]> {
        return httpService.get<Category[]>('categories');
    }
};
