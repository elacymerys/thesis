from typing import Optional


class Category:
    def __init__(self, id: Optional[int] = None, name: Optional[str] = None, search_word: Optional[str] = None):
        self.id = id
        self.name = name
        self.search_word = search_word

    def __repr__(self):
        text = ''
        if self.id is not None:
            text += f'id: {self.id}, '
        if self.name is not None:
            text += f'name: {self.name}, '
        if self.search_word is not None:
            text += f'search word: {self.search_word}'
        return text
