import logging
from contextlib import contextmanager

from api import app
from config import WebConfig
from fastapi.middleware.cors import CORSMiddleware

from database import engine as db_engine, NAME as DB_NAME, get_db
from database.models import Base, CategoryModel, TermModel
from services.category_service import CategoryService
from services.term_service import TermService

if WebConfig.CORS_ENABLED:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=WebConfig.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


Base.metadata.create_all(db_engine)

logging.info(f'Initialize database {DB_NAME}')

with contextmanager(get_db)() as db:
    category_service = CategoryService.build(db)
    category_service.add_all(fn='../categories.txt')
    db.commit()

logging.info(f'Add all categories from file to database {DB_NAME}')

with contextmanager(get_db)() as db:
    term_service = TermService.build(db)
    term_service.setup_all()
    db.commit()
