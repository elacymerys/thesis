from sqlalchemy.orm import Session

from database.models import CategoryModel
from persistence.objects import Category


class CategoryDAO:
    def __init__(self, db: Session):
        self.__db = db

    def exists(self, category_id: int) -> bool:
        return self.__db.query(CategoryModel).filter(CategoryModel.id == category_id).count() > 0

    def exists_with_name(self, category_name: str) -> bool:
        return self.__db.query(CategoryModel).filter(CategoryModel.name == category_name).count() > 0

    def get_all(self) -> list[Category]:
        models = self.__db.query(CategoryModel).all()
        return [Category.from_model(m) for m in models]

    def get_one_by_id(self, category_id: int) -> Category:
        return self.__db.query(CategoryModel).filter(CategoryModel.id == category_id).first()

    def get_one_by_name(self, category_name: str) -> Category:
        return self.__db.query(CategoryModel).filter(CategoryModel.name == category_name).first()

    def save_all(self, categories: list[Category]):
        self.__db.add_all([CategoryModel(name=category.name, search_word=category.search_word)
                           for category in categories])

    def update_search_word(self, updated_category: Category):
        model = self.__db.query(CategoryModel).filter(CategoryModel.name == updated_category.name).first()
        model.search_word = updated_category.search_word
        self.__db.add(model)

    def update_search_words(self, updated_categories: list[Category]):
        updated_models = []
        for updated_category in updated_categories:
            model = self.__db.query(CategoryModel).filter(CategoryModel.name == updated_category.name).first()
            model.search_word = updated_category.search_word
            updated_models.append(model)
        self.__db.add_all(updated_models)
