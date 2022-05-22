from pydantic import Field
from pydantic.main import BaseModel


class CategoryBase(BaseModel):
    name: str


class CategoryResponse(CategoryBase):
    id: int


class CategoryListResponse(BaseModel):
    categories: list[CategoryResponse]


class TermBase(BaseModel):
    id: int
    name: str


class TermResponse(TermBase):
    pass


class QuestionBase(BaseModel):
    question: str
    correct: TermResponse
    answers: list[str]


class QuestionResponse(QuestionBase):
    pass


class AnswerRequest(BaseModel):
    correct_id: int = Field(alias='correctId')
    is_correct: str = Field(alias='isCorrect')
