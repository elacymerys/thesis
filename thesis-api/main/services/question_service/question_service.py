import random

from sqlalchemy.orm import Session

from errors import WrongDifficultyException
from persistence.objects import Question, Term
from services.question_service.definition_processing_service import DefinitionProcessingService
from services.question_service.definition_service import WikipediaDefinitionService
from services.question_service.wrong_answers_service import DatamuseWrongAnswerService
from services.term_service import TermService
from web.schemas import AnswerRequest


INITIAL_DIFFICULTY_WEIGHT = 100


class QuestionService:
    def __init__(self, term_service: TermService, definition_service: WikipediaDefinitionService):
        self.term_service = term_service
        self.definition_service = definition_service

    @staticmethod
    def build(db: Session):
        return QuestionService(
            TermService.build(db),
            WikipediaDefinitionService()
        )

    def create_question(self, category_id: int) -> Question:
        term = self.term_service.get_random(category_id)
        return self.__create_question(term)

    def answer_question(self, answer: AnswerRequest):
        term = self.term_service.get_one_by_id(answer.correct_id)

        term.total_answers_counter += 1
        if answer.is_correct:
            term.correct_answers_counter += 1

        term.difficulty = (
                (term.initial_difficulty * INITIAL_DIFFICULTY_WEIGHT) +
                term.correct_answers_counter
        ) / (INITIAL_DIFFICULTY_WEIGHT + term.total_answers_counter)

        self.term_service.update_difficulty(term)

    def create_question_with_given_difficulty(self, category_id: int, difficulty: float) -> Question:
        if difficulty < 0 or difficulty > 1:
            raise WrongDifficultyException()
        term = self.term_service.get_term_close_to_difficulty(category_id, difficulty)
        return self.__create_question(term)

    def __create_question(self, term: Term) -> Question:
        definition, article_title = self.definition_service.get_definition(term.name)
        definition_processing_service = DefinitionProcessingService(definition, term.name, article_title)
        processed_definition = definition_processing_service. \
            standardize_definition_length(). \
            remove_answer_from_definition(). \
            wrap_text(). \
            get_definition()

        wrong_answers_service = DatamuseWrongAnswerService(self.term_service)
        wrong_answers = wrong_answers_service.get_wrong_answers(term)

        answers = [term.name] + wrong_answers
        random.shuffle(answers)

        question = Question(question=processed_definition, correct=term, answers=answers)
        return question
