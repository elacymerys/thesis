from __future__ import annotations
import textwrap

from services.question_service.edit_distance_service import EditDistanceService


class DefinitionProcessingService:
    def __init__(self, definition: str, answer: str, article_title: str):
        self.definition = definition
        self.answer = answer
        self.article_title = article_title
        self.line_length = 120
        self.definition_length = 300
        self.edit_distance_service = EditDistanceService()

    def standardize_definition_length(self) -> DefinitionProcessingService:
        definition_split = self.definition.split('.')
        current_definition_length = 0
        definition_array = []
        for sentence in definition_split:
            if current_definition_length + len(sentence) < self.definition_length or len(definition_array) == 0:
                definition_array.append(sentence)
                current_definition_length += len(sentence)
            else:
                break
        self.definition = ".".join(definition_array) + "."
        return self

    def wrap_text(self) -> DefinitionProcessingService:
        self.definition = textwrap.fill(self.definition, width=self.line_length)
        return self

    def remove_answer_from_definition(self) -> DefinitionProcessingService:
        words = self.definition.split()
        distances_to_right_answer = {}
        for word in words:
            distances_to_right_answer[word] = self.edit_distance_service.edit_distance(word, self.answer)

        if self.answer != self.article_title:
            distances_to_article_title = {}
            for word in words:
                distances_to_article_title[word] = self.edit_distance_service.edit_distance(word, self.article_title)
            for word_key in distances_to_right_answer.keys():
                distances_to_right_answer[word_key] = \
                    min(distances_to_right_answer[word_key], distances_to_article_title[word_key])

        distances_values = sorted(distances_to_right_answer.values())
        censor_value = distances_values[len(distances_to_right_answer) // 20]
        summary_censored = []
        for word in words:
            if distances_to_right_answer[word] > censor_value:
                if word in self.answer or self.answer in word or \
                        word in self.article_title or self.article_title in word:
                    summary_censored.append("*****")
                else:
                    summary_censored.append(word)
            else:
                summary_censored.append("*****")
        self.definition = " ".join(summary_censored)
        return self

    def get_definition(self) -> str:
        return self.definition
