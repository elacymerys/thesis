import random

from sqlalchemy.orm import Session

from persistence.objects import Question
from services.question_service.definition_processing_service import DefinitionProcessingService
from services.question_service.definition_service import WikipediaDefinitionService
from services.question_service.wrong_answers_service import DatamuseWrongAnswerService
from services.term_service import TermService


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

        question = Question(question=processed_definition, correct=term.name, answers=answers)
        return question
