from sqlalchemy import Column, Integer, String

from . import Base, engine

import logging

from config import DBConfig


class CategoryModel(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, unique=True, nullable=False)
    search_word = Column(String, unique=True, nullable=False)


Base.metadata.create_all(engine)

logging.info(f"Initialize database '{DBConfig.NAME}'")
