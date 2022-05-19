from sqlalchemy.testing.plugin.plugin_base import logging

from database import engine as db_engine, NAME as DB_NAME
from database.models import Base
from api import app

app = app

Base.metadata.create_all(db_engine)

logging.info(f'Initialize database {DB_NAME}')
