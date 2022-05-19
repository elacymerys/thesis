from database.models import CategoryModel
from persistence.objects import Category


def exists(db, id: int) -> bool:
    return db.query(CategoryModel).filter(CategoryModel.id == id).count() > 0


def get_all(db) -> list[Category]:
    return db.query(CategoryModel).all() or []
