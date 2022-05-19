from random import randrange

from fastapi import Depends

from database import get_db
from database.models import TermModel
from errors import NotFoundException
from persistence import term_crud, category_crud
from persistence.objects import Term


class TermService:
    def __init__(self, db=Depends(get_db)):
        self.__db = db

    def save_all(self, terms: list[str], category_id: int):
        if not category_crud.exists(self.__db, category_id):
            raise NotFoundException()

        term_crud.save_all(self.__db, [TermModel(name=t, category_id=category_id) for t in terms])
        self.__db.commit()

    def get_random(self, category_id: int) -> Term:
        if not category_crud.exists(self.__db, category_id):
            raise NotFoundException()

        if not term_crud.exists(self.__db, category_id):
            raise NotFoundException()

        terms = term_crud.get_all(self.__db, category_id)
        random_term = terms[randrange(0, len(terms))]
        return Term.from_model(random_term)
