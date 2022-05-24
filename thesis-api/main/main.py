import logging
from contextlib import contextmanager

from api import app
from database import engine as db_engine, NAME as DB_NAME, get_db
from database.models import Base
from services.category_service import CategoryService

app = app

Base.metadata.create_all(db_engine)

logging.info(f'Initialize database {DB_NAME}')

with contextmanager(get_db)() as db:
    category_service = CategoryService.build(db)
    category_service.add_all(fn='../categories.txt')

logging.info(f'Add all categories from file to database {DB_NAME}')
