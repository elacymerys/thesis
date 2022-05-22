import Api from "../common/api"
import {Categories, Question} from "../common/types";

const getCategoriesList = async () => {
    const response = await Api.get<Categories>('/api/categories')
    return response.data.categories;
}
const getQuestion = async () => {
    const response = await Api.get<Question>('/api/questions/1')
    return response.data;
}
export {getCategoriesList, getQuestion}