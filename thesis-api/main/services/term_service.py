from random import randrange

from sqlalchemy.orm import Session

from errors import NotFoundException
from persistence.category_dao import CategoryDAO
from persistence.objects import Term
from persistence.term_dao import TermDAO


class TermService:
    def __init__(self, term_dao: TermDAO, category_dao: CategoryDAO):
        self.__term_dao = term_dao
        self.__category_dao = category_dao

    @staticmethod
    def build(db: Session):
        return TermService(
            TermDAO(db),
            CategoryDAO(db)
        )

    def save_all(self, term_names: list[str], category_id: int):
        if not self.__category_dao.exists(category_id):
            raise NotFoundException()

        terms_in_db = self.__term_dao.get_all_of_category(category_id)
        term_names_in_db = [t.name for t in terms_in_db]
        new_term_names = [t for t in term_names if t not in term_names_in_db]

        self.__term_dao.save_all_of_category(new_term_names, category_id)

    def get_random(self, category_id: int) -> Term:
        terms = self.__term_dao.get_all_of_category(category_id)
        if not terms:
            raise NotFoundException()

        return terms[randrange(0, len(terms))]

    def term_exists_of_category(self, term: str, category_id: int) -> bool:
        return self.__term_dao.exists_of_category(term, category_id)
    