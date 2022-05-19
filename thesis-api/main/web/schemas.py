from pydantic.main import BaseModel


class CategoryBase(BaseModel):
    name: str


class CategoryResponse(CategoryBase):
    id: int


class CategoryListResponse(BaseModel):
    categories: list[CategoryResponse]
