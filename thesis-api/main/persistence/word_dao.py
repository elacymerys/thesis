import random

from fastapi import Depends

from database import SessionLocal, get_db


class WordDAO:
    def __init__(self, db: SessionLocal = Depends(get_db)):
        self.__db = db

    def get_words_by_category_id(self, category_id: int) -> list[str]:
        words = ["lion", "apple"]
        return [random.choice(words)]
