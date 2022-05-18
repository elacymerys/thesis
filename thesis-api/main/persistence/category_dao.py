from typing import List

from fastapi import Depends

from database import SessionLocal, get_db
from database.models import CategoryModel
from persistence.objects import Category


class CategoryDAO:
    def __init__(self, db: SessionLocal = Depends(get_db())):
        self.__db = db

    def get_all(self) -> List[Category]:
        categories = self.__db.query(CategoryModel).all()

        return [Category(id=category.id, name=category.name) for category in categories]
