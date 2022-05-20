from typing import List

from sqlalchemy.orm import Session

from persistence.category_dao import CategoryDAO
from persistence.objects import Category


class CategoryService:
    def __init__(self, dao: CategoryDAO):
        self.__dao = dao

    @staticmethod
    def build(db: Session):
        return CategoryService(CategoryDAO(db))

    def get_all(self) -> List[Category]:
        return self.__dao.get_all()
