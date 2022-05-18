from typing import List

from fastapi import Depends

from persistence.category_dao import CategoryDAO
from persistence.objects import Category


class CategoryService:
    def __init__(self, dao: CategoryDAO = Depends()):
        self.__dao = dao

    def get_all(self) -> List[Category]:
        return self.__dao.get_all()
