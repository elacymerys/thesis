export interface CategoryResponse {
    categories: CategoryResponseItem[]
}

interface CategoryResponseItem {
    id: number,
    name: string
}