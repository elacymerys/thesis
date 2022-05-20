from contextlib import contextmanager

import pytest

from database.models import CategoryModel, TermModel
from errors import NotFoundException
from services.term_service import TermService
from test import get_test_db


def test_save_all__non_existing_category__raises():
    with contextmanager(get_test_db)() as db:
        service = TermService.build(db)
        with pytest.raises(NotFoundException):
            service.save_all(['t1', 't2', 't3'], 5)
            db.flush()


def test_save_all__existing_category__saves():
    with contextmanager(get_test_db)() as db:
        db.add(CategoryModel(id=5, name='c1', search_word='c1'))
        db.flush()

        service = TermService.build(db)
        service.save_all(['t1', 't2', 't3'], 5)
        db.flush()

        assert db.query(TermModel).count() == 3


def test_get_random__non_existing_category__raises():
    with contextmanager(get_test_db)() as db:
        service = TermService.build(db)
        with pytest.raises(NotFoundException):
            service.get_random(5)


def test_get_random__no_terms__raises():
    with contextmanager(get_test_db)() as db:
        db.add(CategoryModel(id=5, name='c1', search_word='c1'))
        db.flush()

        service = TermService.build(db)
        with pytest.raises(NotFoundException):
            service.get_random(5)


def test_get_random__existing_terms__returns_one():
    with contextmanager(get_test_db)() as db:
        db.add(CategoryModel(id=5, name='c1', search_word='c1'))
        db.flush()

        db.add(TermModel(name='t1', category_id=5))
        db.add(TermModel(name='t2', category_id=5))
        db.flush()

        service = TermService.build(db)
        random_term = service.get_random(5)

        assert random_term.name in ['t1', 't2']
