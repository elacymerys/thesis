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

    def create(self, category: Category) -> int:
        category_model = CategoryModel(name=category.name, search_word=category.search_word)
        self.__db.add(category_model)
        self.__db.commit()

        self.__db.refresh(category_model)
        return category_model.id

    def get_all(self) -> list[Category]:
        models = self.__db.query(CategoryModel).all()
        return [Category.from_model(m) for m in models]

    def get_one_by_id(self, category_id: int) -> Category:
        return self.__db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
