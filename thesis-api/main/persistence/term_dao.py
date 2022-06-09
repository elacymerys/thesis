from typing import Optional

from sqlalchemy import and_
from sqlalchemy.orm import Session

from database.models import TermModel
from persistence.objects import Term


class TermDAO:
    def __init__(self, db: Session):
        self.__db = db

    def save_all(self, terms: list[Term]):
        self.__db.add_all([TermModel(name=t.name, initial_difficulty=t.initial_difficulty,
                                     correct_answers_counter=t.correct_answers_counter,
                                     total_answers_counter=t.total_answers_counter,
                                     difficulty=t.difficulty, category_id=t.category.id)
                           for t in terms])

    def get_all_of_category(self, category_id: int) -> list[Term]:
        models = self.__db.query(TermModel).filter(TermModel.category_id == category_id).all()
        return [Term.from_model(m) for m in models]

    def exists_of_category(self, term: str, category_id: int) -> bool:
        return self.__db.query(TermModel) \
                   .filter((TermModel.name == term) & (TermModel.category_id == category_id)) \
                   .count() > 0

    def get_one_by_id(self, term_id: int) -> Optional[Term]:
        model = self.__db.query(TermModel).filter(TermModel.id == term_id).first()
        return Term.from_model(model)

    def get_close_to_difficulty(self, category_id: int, difficulty: float, difficulty_span: float) -> list[Term]:
        models = self.__db.query(TermModel).filter(and_(TermModel.category_id == category_id,
                                                   difficulty - difficulty_span < TermModel.difficulty,
                                                   TermModel.difficulty < difficulty + difficulty_span)).all()
        return [Term.from_model(m) for m in models]

    def update_difficulty(self, updated_term: Term):
        model = self.__db.query(TermModel).filter(TermModel.id == updated_term.id).first()
        model.correct_answers_counter = updated_term.correct_answers_counter
        model.total_answers_counter = updated_term.total_answers_counter
        model.difficulty = updated_term.difficulty

        self.__db.add(model)
