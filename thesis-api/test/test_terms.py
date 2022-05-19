import pytest

from database.models import CategoryModel, TermModel
from errors import NotFoundException
from services.term_service import TermService
from test import TestSessionLocal, test_engine


def test_save_all__non_existing_category__raises():
    conn = test_engine.connect()
    conn.execute("PRAGMA foreign_keys=ON")

    transaction = conn.begin()
    db = TestSessionLocal(bind=conn)
    try:
        service = TermService(db)
        with pytest.raises(NotFoundException):
            service.save_all(['t1', 't2', 't3'], 5)
            db.flush()
    finally:
        transaction.rollback()
        db.close()
        conn.close()


def test_save_all__existing_category__saves():
    conn = test_engine.connect()
    conn.execute("PRAGMA foreign_keys=ON")

    transaction = conn.begin()
    db = TestSessionLocal(bind=conn)
    try:
        db.add(CategoryModel(id=5, name='c1', search_word='c1'))
        db.flush()

        service = TermService(db)
        service.save_all(['t1', 't2', 't3'], 5)
        db.flush()

        assert db.query(TermModel).count() == 3
    finally:
        transaction.rollback()
        db.close()
        conn.close()


def test_get_random__non_existing_category__raises():
    conn = test_engine.connect()
    conn.execute("PRAGMA foreign_keys=ON")

    transaction = conn.begin()
    db = TestSessionLocal(bind=conn)
    try:
        service = TermService(db)
        with pytest.raises(NotFoundException):
            service.get_random(5)
    finally:
        transaction.rollback()
        db.close()
        conn.close()


def test_get_random__no_terms__raises():
    conn = test_engine.connect()
    conn.execute("PRAGMA foreign_keys=ON")

    transaction = conn.begin()
    db = TestSessionLocal(bind=conn)
    try:
        db.add(CategoryModel(id=5, name='c1', search_word='c1'))
        db.flush()

        service = TermService(db)
        with pytest.raises(NotFoundException):
            service.get_random(5)
    finally:
        transaction.rollback()
        db.close()
        conn.close()


def test_get_random__existing_terms__returns_one():
    conn = test_engine.connect()
    conn.execute("PRAGMA foreign_keys=ON")

    transaction = conn.begin()
    db = TestSessionLocal(bind=conn)
    try:
        db.add(CategoryModel(id=5, name='c1', search_word='c1'))
        db.flush()

        db.add(TermModel(name='t1', category_id=5))
        db.add(TermModel(name='t2', category_id=5))
        db.flush()

        service = TermService(db)
        random_term = service.get_random(5)

        assert random_term.name in ['t1', 't2']
    finally:
        transaction.rollback()
        db.close()
        conn.close()
