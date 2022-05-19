from fastapi import Depends

from database import SessionLocal, get_db
from database.models import CategoryModel, TermModel
from errors import NotFoundException


class TermDAO:
    def __init__(self, db: SessionLocal = Depends(get_db)):
        self.__db = db

    def save_all(self, terms: list[str], category_name: str):
        category = self.__db.query(CategoryModel).filter(CategoryModel.name == category_name).first()
        if category is None:
            raise NotFoundException()

        term_models = [TermModel(name=t, category=category) for t in terms]
        self.__db.add_all(term_models)
        self.__db.commit()
