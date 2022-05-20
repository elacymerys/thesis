import logging

from api import app
from database import engine as db_engine, NAME as DB_NAME
from database.models import Base

app = app

Base.metadata.create_all(db_engine)

logging.info(f'Initialize database {DB_NAME}')
