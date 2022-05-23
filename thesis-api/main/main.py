import logging
from contextlib import contextmanager

from api import app
from database import engine as db_engine, NAME as DB_NAME
from database.models import Base, CategoryModel, TermModel
from services.term_service import TermService
from database import get_db

app = app

Base.metadata.create_all(db_engine)

# TODO: load from file instead of these hard-coded values
with contextmanager(get_db)() as db:
    category_names_in_db = [c.name for c in db.query(CategoryModel).all()]

    categories_to_add = [
        CategoryModel(name='animal', search_word='type+of+animal'),
        CategoryModel(name='herb', search_word='type+of+herb')
    ]

    db.add_all([c for c in categories_to_add if c.name not in category_names_in_db])
    db.commit()
# TODO: end

with contextmanager(get_db)() as db:
    term_service = TermService.build(db)
    term_service.setup_all()
    db.commit()


logging.info(f'Initialize database {DB_NAME}')
