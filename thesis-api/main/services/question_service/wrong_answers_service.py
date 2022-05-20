import random
from abc import ABC, abstractmethod
from datamuse import Datamuse

from persistence.objects import Term
from services.question_service.edit_distance_service import EditDistanceService
from services.term_service import TermService


class WrongAnswersService(ABC):
    @abstractmethod
    def get_wrong_answers(self, term: Term) -> list[str]:
        pass


class DatamuseWrongAnswerService(WrongAnswersService):
    def __init__(self, term_service: TermService):
        self.api = Datamuse()
        self.frequency_threshold = 0.25
        self.answer_choice_probability = 0.7
        self.edit_distance_service = EditDistanceService()
        self.edit_distance_value = 2
        self.term_service = term_service

    def get_wrong_answers(self, right_answer: Term) -> list[str]:
        related_words = self.api.words(ml=right_answer.name, md='f')
        related_nouns = []
        for word in related_words:
            if "n" in word["tags"] and "syn" not in word["tags"]:
                word["tags"][-1] = float(word["tags"][-1][2:])
                related_nouns.append(word)

        related_nouns_frequency_sorted = sorted(related_nouns, key=lambda frequency: frequency["tags"][-1])
        minimum_frequency_threshold = related_nouns_frequency_sorted[
            int(len(related_nouns_frequency_sorted) * self.frequency_threshold)]["tags"][-1]

        wrong_answers = []

        for potential_answer in related_nouns:
            if len(wrong_answers) == 3:
                break
            if potential_answer["tags"][-1] < minimum_frequency_threshold:
                continue
            if random.random() > self.answer_choice_probability:
                continue
            if (potential_answer["word"] in right_answer.name) or (right_answer.name in potential_answer["word"]):
                continue
            if self.edit_distance_service.edit_distance(potential_answer["word"], right_answer.name) < \
                    self.edit_distance_value:
                continue
            stop = False
            for wrong_answer in wrong_answers:
                if (potential_answer["word"] in wrong_answer) or (wrong_answer in potential_answer["word"]):
                    stop = True
                    break
                if self.edit_distance_service.edit_distance(potential_answer["word"], wrong_answer) < \
                        self.edit_distance_value:
                    stop = True
                    break
            if not self.term_service.term_exists_of_category(potential_answer["word"], right_answer.category.id):
                continue
            if not stop:
                wrong_answers.append(potential_answer["word"])

        if len(wrong_answers) < 3:
            for potential_answer in related_nouns:
                if len(wrong_answers) == 3:
                    break
                if potential_answer["tags"][-1] > minimum_frequency_threshold \
                        and potential_answer["word"] not in wrong_answers:
                    wrong_answers.append(potential_answer["word"])

        return wrong_answers
