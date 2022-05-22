from typing import Optional

from sqlalchemy.orm import Session

from database.models import TermModel
from persistence.objects import Term


class TermDAO:
    def __init__(self, db: Session):
        self.__db = db

    def save_all_of_category(self, terms: list[str], category_id: int):
        self.__db.add_all([TermModel(name=t, category_id=category_id) for t in terms])

    def get_all_of_category(self, category_id: int) -> list[Term]:
        models = self.__db.query(TermModel).filter(TermModel.category_id == category_id).all()
        return [Term.from_model(m) for m in models]

    def exists_of_category(self, term: str, category_id: int) -> bool:
        return self.__db.query(TermModel) \
                   .filter((TermModel.name == term) & (TermModel.category_id == category_id)) \
                   .count() > 0

    def get_one_by_id(self, term_id: int) -> Optional[Term]:
        return self.__db.query(TermModel).filter(TermModel.id == term_id).first()

    def update_difficulty(self, term_id: int, new_difficulty: float):
        model = self.get_one_by_id(term_id)
        model.difficulty = new_difficulty
