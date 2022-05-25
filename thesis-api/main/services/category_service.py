import csv
from typing import List

from sqlalchemy.orm import Session

from errors import NotFoundException
from persistence.category_dao import CategoryDAO
from persistence.objects import Category


class CategoryService:
    def __init__(self, dao: CategoryDAO):
        self.__dao = dao

    @staticmethod
    def build(db: Session):
        return CategoryService(CategoryDAO(db))

    def add_all(self, fn: str):
        with open(fn, mode='r') as csv_file:
            categories_in_db = self.__dao.get_all()
            categories_in_db_names = [category.name for category in categories_in_db]
            categories_in_db_search_word = [category.search_word for category in categories_in_db]

            csv_reader = csv.DictReader(csv_file, delimiter=';')
            categories_from_csv = [Category(name=row['name'], search_word=row['search_word']) for row in csv_reader]

            categories_to_update = [category for category in categories_from_csv if
                                    category.name in categories_in_db_names
                                    and category.search_word !=
                                    categories_in_db_search_word[categories_in_db_names.index(category.name)]]
            new_categories = [category for category in categories_from_csv
                              if category.name not in categories_in_db_names]
            self.__dao.update_search_words(categories_to_update)
            self.__dao.save_all(new_categories)

    def get_all(self) -> List[Category]:
        return self.__dao.get_all()

    def get_one_by_id(self, category_id: int) -> Category:
        category = self.__dao.get_one_by_id(category_id)
        if not category:
            raise NotFoundException()

        return category
