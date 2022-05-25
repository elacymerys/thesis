import logging

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from starlette.status import HTTP_200_OK, HTTP_204_NO_CONTENT

from database import get_db
from database.models import TermModel
from errors import NotFoundException
from services.category_service import CategoryService
from services.question_service.question_service import QuestionService
from web.schemas import CategoryListResponse, CategoryResponse, QuestionResponse, AnswerRequest, TermResponse

app = FastAPI()

logging.getLogger().setLevel(logging.INFO)


@app.get('/api/categories', status_code=HTTP_200_OK, response_model=CategoryListResponse)
async def get_categories(db: Session = Depends(get_db)):
    service = CategoryService.build(db)

    categories = service.get_all()
    res = [CategoryResponse(id=category.id, name=category.name) for category in categories]

    return CategoryListResponse(categories=res)


@app.get("/api/questions/{category_id}", status_code=HTTP_200_OK, response_model=QuestionResponse)
async def get_question(category_id: int, db: Session = Depends(get_db)):
    service = QuestionService.build(db)
    try:
        question = service.create_question(category_id)
    except NotFoundException:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="wrong category id")

    return QuestionResponse(
        question=question.question,
        correct=TermResponse(id=question.correct.id, name=question.correct.name),
        answers=question.answers
    )


@app.post("/api/answers", status_code=HTTP_204_NO_CONTENT)
async def get_question(data: AnswerRequest, db: Session = Depends(get_db)):
    service = QuestionService.build(db)
    try:
        service.answer_question(data)
        db.commit()
    except NotFoundException:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="wrong term id")
    finally:
        db.rollback()
