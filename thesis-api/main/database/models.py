from . import Base, engine

import logging

from config import DBConfig


Base.metadata.create_all(engine)

logging.info(f"Initialize database '{DBConfig.NAME}'")
