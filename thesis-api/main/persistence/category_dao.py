from fastapi import Depends

from database import SessionLocal, get_db
from database.models import CategoryModel
from persistence.objects import Category


class CategoryDAO:
    def __init__(self, db: SessionLocal = Depends(get_db)):
        self.__db = db

    def get_all(self) -> list[Category]:
        categories = self.__db.query(CategoryModel).all()

        if categories is None:
            return []
        return [Category(id=c.id, name=c.name) for c in categories]
