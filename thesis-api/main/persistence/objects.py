from typing import Optional


class Category:
    def __init__(self, id: Optional[int] = None, name: Optional[str] = None, search_word: Optional[str] = None):
        self.id = id
        self.name = name
        self.search_word = search_word

    @staticmethod
    def from_model(model):
        return Category(model.id, model.name, model.search_word)

    def __repr__(self):
        text = ''
        if self.id is not None:
            text += f'id: {self.id}, '
        if self.name is not None:
            text += f'name: {self.name}, '
        if self.search_word is not None:
            text += f'search word: {self.search_word}'
        return text


class Term:
    def __init__(self, id: Optional[int] = None, name: Optional[str] = None, category: Optional[Category] = None):
        self.id = id
        self.name = name
        self.category = category

    @staticmethod
    def from_model(model):
        return Term(model.id, model.name, Category.from_model(model.category))

    def __repr__(self) -> str:
        text = ''
        if self.id is not None:
            text += f'id: {self.id}, '
        if self.name is not None:
            text += f'name: {self.name}, '
        if self.category is not None:
            text += f'category: {self.category}'
        return text

      
class Question:
    def __init__(self, question: Optional[str] = None, correct: Optional[str] = None,
                 answers: Optional[list[str]] = None):
        self.question = question
        self.correct = correct
        self.answers = answers

    def __repr__(self):
        text = "\nDefinition:\n\n"
        if self.question is not None:
            text += (self.question + "\n\n")
        if self.answers is not None:
            text += "Answers are:\n"
            text += str(self.answers)
        if self.correct is not None:
            text += ("\nCorrect answer is:  " + self.correct)
        return text
