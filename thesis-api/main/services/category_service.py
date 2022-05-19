from typing import List

from fastapi import Depends

from database import get_db
from persistence import category_crud
from persistence.objects import Category


class CategoryService:
    def __init__(self, db=Depends(get_db)):
        self.__db = db

    def get_all(self) -> List[Category]:
        models = category_crud.get_all(self.__db)
        return [Category.from_model(m) for m in models]
