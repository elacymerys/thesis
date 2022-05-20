from sqlalchemy.orm import Session

from database.models import CategoryModel
from persistence.objects import Category


class CategoryDAO:
    def __init__(self, db: Session):
        self.__db = db

    def exists(self, category_id: int) -> bool:
        return self.__db.query(CategoryModel).filter(CategoryModel.id == category_id).count() > 0

    def get_all(self) -> list[Category]:
        models = self.__db.query(CategoryModel).all()
        return [Category.from_model(m) for m in models]
