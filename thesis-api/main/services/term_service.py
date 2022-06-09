import random
from random import randrange

from datamuse import Datamuse
from sqlalchemy.orm import Session

from errors import NotFoundException
from persistence.objects import Term, Category
from persistence.term_dao import TermDAO
from services.category_service import CategoryService


REJECTED_PERCENT = 0
DIFFICULTY_LEVEL_SPAN_INCREASE = 0.1
DIFFICULTY_LEVEL_STARTING_SPAN = 0.1


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

    def get_term_close_to_difficulty(self, category_id: int, difficulty: float) -> Term:
        difficulty_span = DIFFICULTY_LEVEL_STARTING_SPAN
        while True:
            if difficulty_span > 1:
                raise NotFoundException()
            terms_in_db = self.__dao.get_close_to_difficulty(category_id, difficulty, difficulty_span)
            if terms_in_db:
                return random.choice(terms_in_db)
            else:
                difficulty_span += DIFFICULTY_LEVEL_SPAN_INCREASE

    def term_exists_of_category(self, term: str, category_id: int) -> bool:
        return self.__dao.exists_of_category(term, category_id)

    def update_difficulty(self, updated_term: Term):
        self.__dao.update_difficulty(updated_term)

    def __setup_one(self, category: Category):
        terms_in_db = self.__dao.get_all_of_category(category.id)
        if len(terms_in_db) >= 1000:
            return
        term_names_in_db = [t.name for t in terms_in_db]

        terms_from_api = self.__datamuse.words(ml=category.search_word, md='f', max=1000)
        for term in terms_from_api:
            term['tags'][-1] = float(term['tags'][-1][2:])

        terms_from_api.sort(key=lambda t: t['tags'][-1], reverse=True)
        items_taken = int((1 - (REJECTED_PERCENT / 100)) * len(terms_from_api))
        terms_from_api = terms_from_api[:items_taken]

        new_terms_from_api = [t for t in terms_from_api
                              if 'n' in t['tags'] and t['word'] not in term_names_in_db]

        if not new_terms_from_api:
            return

        new_terms_from_api = new_terms_from_api[:min(len(new_terms_from_api), 1000 - len(terms_in_db))]

        max_frequency = terms_from_api[0]['tags'][-1]

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
