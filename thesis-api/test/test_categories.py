from database.models import CategoryModel
from services.category_service import CategoryService
from test import test_engine, TestSessionLocal


def test_get_all__returnsAll():
    conn = test_engine.connect()
    conn.execute("PRAGMA foreign_keys=ON")

    transaction = conn.begin()
    db = TestSessionLocal(bind=conn)
    try:
        db.add(CategoryModel(name='c1', search_word='c1'))
        db.add(CategoryModel(name='c2', search_word='c2'))
        db.flush()

        service = CategoryService(db)
        categories = service.get_all()

        assert categories[0].name == 'c1'
        assert categories[1].name == 'c2'
    finally:
        transaction.rollback()
        db.close()
        conn.close()
