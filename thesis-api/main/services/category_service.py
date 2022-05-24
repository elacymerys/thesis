import csv
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

    def create_all(self, fn: str):
        with open(fn, mode='r') as csv_file:
            csv_reader = csv.DictReader(csv_file, delimiter=';')
            for row in csv_reader:
                if self.__dao.exists_with_name(row['name']):
                    continue
                category = Category(name=row['name'], search_word=row['search_word'])
                self.__dao.create(category)

    def get_all(self) -> List[Category]:
        return self.__dao.get_all()
