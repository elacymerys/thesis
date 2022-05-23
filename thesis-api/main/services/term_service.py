from random import randrange

from datamuse import Datamuse
from sqlalchemy.orm import Session

from errors import NotFoundException
from persistence.objects import Term, Category
from persistence.term_dao import TermDAO
from services.category_service import CategoryService


class TermService:
    def __init__(self, dao: TermDAO, category_service: CategoryService, datamuse: Datamuse):
        self.__dao = dao
        self.__category_service = category_service
        self.__datamuse = datamuse

    @staticmethod
    def build(db: Session):
        return TermService(
            TermDAO(db),
            CategoryService.build(db),
            Datamuse()
        )

    def setup_all(self):
        categories = self.__category_service.get_all()
        for category in categories:
            self.__setup_one(category)

    def get_random(self, category_id: int) -> Term:
        terms = self.__dao.get_all_of_category(category_id)
        if not terms:
            raise NotFoundException()

        return terms[randrange(0, len(terms))]

    def get_one_by_id(self, term_id: int) -> Term:
        term = self.__dao.get_one_by_id(term_id)
        if not term:
            raise NotFoundException()

        return term

    def term_exists_of_category(self, term: str, category_id: int) -> bool:
        return self.__dao.exists_of_category(term, category_id)

    def update_difficulty(self, updated_term: Term):
        self.__dao.update_difficulty(updated_term)

    def __setup_one(self, category: Category):
        terms_in_db = self.__dao.get_all_of_category(category.id)
        term_names_in_db = [t.name for t in terms_in_db]

        terms_from_api = self.__datamuse.words(ml=category.search_word, md='f', max=1000)
        new_terms_from_api = [t for t in terms_from_api if t['word'] not in term_names_in_db]

        if not new_terms_from_api:
            return

        for term in new_terms_from_api:
            term['tags'][-1] = float(term['tags'][-1][2:])

        frequencies = [t['tags'][-1] for t in new_terms_from_api]
        max_frequency = max(frequencies)

        new_terms = [
            Term(
                name=t['word'],
                initial_difficulty=(t['tags'][-1] / max_frequency),
                difficulty=(t['tags'][-1] / max_frequency),
                category=category
            )
            for t in new_terms_from_api
        ]

        self.__dao.save_all(new_terms)
