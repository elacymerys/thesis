from database.models import TermModel
from persistence.objects import Term


def save_all(db, terms: list[TermModel]):
    db.add_all(terms)


def get_all(db, category_id: int) -> list[Term]:
    return db.query(TermModel).filter(TermModel.category_id == category_id).all() or []


def exists(db, category_id: int) -> bool:
    return db.query(TermModel).filter(TermModel.category_id == category_id).count() > 0
