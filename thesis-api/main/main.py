import logging

from fastapi import FastAPI, Depends
from starlette.status import HTTP_200_OK

from services.category_service import CategoryService
from services.question_service.question_service import QuestionService
from web.schemas import CategoryListResponse, CategoryResponse, QuestionResponse

app = FastAPI()

logging.getLogger().setLevel(logging.INFO)


@app.get("/api/categories", status_code=HTTP_200_OK, response_model=CategoryListResponse)
async def get_categories(service: CategoryService = Depends()):
    categories = service.get_all()
    res = [CategoryResponse(id=category.id, name=category.name) for category in categories]
    return CategoryListResponse(categories=res)


@app.get("/api/questions/{category_id}", status_code=HTTP_200_OK, response_model=QuestionResponse)
async def get_question(category_id: int, service: QuestionService = Depends()):
    question = service.create_question(category_id)
    return QuestionResponse(question=question.question, correct=question.correct, answers=question.answers)
