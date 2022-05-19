import random

from fastapi import Depends

from persistence.objects import Question
from persistence.word_dao import WordDAO
from services.question_service.definition_processing_service import DefinitionProcessingService
from services.question_service.definition_service import WikipediaDefinitionService
from services.question_service.wrong_answers_service import DatamuseWrongAnswerService


class QuestionService:
    def __init__(self, dao: WordDAO = Depends(), definition_service: WikipediaDefinitionService = Depends()):
        self.__dao = dao
        self.definition_service = definition_service

    def create_question(self, category_id: int) -> Question:
        # pobierz hasła z danej kategorii
        words = self.__dao.get_words_by_category_id(category_id)

        # wylosuj jedno hasło
        right_answer = random.choice(words)

        # wygeneruj definicję dla tego hasła i zagwiazdkuj
        definition, article_title = self.definition_service.get_definition(right_answer)
        definition_processing_service = DefinitionProcessingService(definition, right_answer, article_title)
        processed_definition = definition_processing_service. \
            standardize_definition_length(). \
            remove_answer_from_definition(). \
            wrap_text(). \
            get_definition()

        # pobierz 3 podobne hasła do odpowiedzi z słownika
        wrong_answers_service = DatamuseWrongAnswerService()
        wrong_answers = wrong_answers_service.get_wrong_answers(right_answer)

        answers = [right_answer] + wrong_answers
        random.shuffle(answers)
        # zwróc pytanie
        question = Question(question=processed_definition, correct=right_answer, answers=answers)
        # print(question)
        # with open("./question_generation_report.txt", "a", ) as f:
        #     f.write(str(question))
        return question
