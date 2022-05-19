from random import randint, randrange

from fastapi import Depends

from database import SessionLocal, get_db
from database.models import CategoryModel, TermModel
from errors import NotFoundException
from persistence.objects import Term


class TermDAO:
    def __init__(self, db: SessionLocal = Depends(get_db)):
        self.__db = db

    def save_all(self, terms: list[str], category_id: int):
        category = self.__db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
        if category is None:
            raise NotFoundException()

        term_models = [TermModel(name=t, category=category) for t in terms]
        self.__db.add_all(term_models)
        self.__db.commit()

    def get_one_random(self, category_id: int) -> Term:
        terms = self.__db.query(TermModel).filter(TermModel.category_id == category_id).all()
        if terms is None or len(terms) == 0:
            raise NotFoundException()

        term_model = terms[randrange(0, len(terms))]
        return Term.from_model(term_model)


