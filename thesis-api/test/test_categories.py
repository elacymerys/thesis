from contextlib import contextmanager

from database.models import CategoryModel
from services.category_service import CategoryService
from test import get_test_db


def test_get_all__returns_all():
    with contextmanager(get_test_db)() as db:
        db.add(CategoryModel(name='c1', search_word='c1'))
        db.add(CategoryModel(name='c2', search_word='c2'))
        db.flush()

        service = CategoryService.build(db)
        categories = service.get_all()

        assert categories[0].name == 'c1'
        assert categories[1].name == 'c2'
