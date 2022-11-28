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
        self.exception_word = ["the", "and", "are", "for", "not", "but", "had", "has", "was", "all", "any", "one",
                               "man", "out", "you", "his", "her", "can"]

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
        text = self.definition
        if text[-2] == ".":
            text = text[:len(text)-1]
        delimiters_postfixes = [",", ".", "!", "?", ";", "]"]
        delimiters_prefixes = ["["]
        white_space_replacer = "###"
        text = text.replace("  ", " ")
        text = text.replace(" ", " " + white_space_replacer + " ")
        for delimiter in delimiters_postfixes:
            text = text.replace(delimiter, " " + delimiter)
        for delimiter in delimiters_postfixes:
            text = text.replace(delimiter, delimiter + " ")
        for delimiter in delimiters_postfixes:
            text = text.replace(delimiter + "  ", delimiter + "&&&")
        for delimiter in delimiters_postfixes:
            text = text.replace(delimiter + " ", delimiter + " " + white_space_replacer + " ")
        for delimiter in delimiters_postfixes:
            text = text.replace(delimiter + "&&&", delimiter + " ")
        for delimiter in delimiters_prefixes:
            text = text.replace(delimiter, delimiter + " ")
        for delimiter in delimiters_prefixes:
            text = text.replace(delimiter, " " + delimiter)
        for delimiter in delimiters_prefixes:
            text = text.replace("  " + delimiter, "&&&" + delimiter)
        for delimiter in delimiters_prefixes:
            text = text.replace(" " + delimiter, " " + white_space_replacer + " " + delimiter)
        for delimiter in delimiters_prefixes:
            text = text.replace("&&&" + delimiter, " " + delimiter)

        words = text.split()
        distances_to_right_answer = {}
        for word in words:
            if word not in delimiters_prefixes and word not in delimiters_postfixes and word != white_space_replacer:
                if len(word) > 2 and word not in self.exception_word:
                    for answer_word in self.answer.split():
                        if word not in distances_to_right_answer:
                            distances_to_right_answer[word] = self.edit_distance_service.edit_distance(word,
                                                                                                       answer_word)
                        else:
                            distances_to_right_answer[word] = min(distances_to_right_answer[word],
                                                                  self.edit_distance_service.edit_distance(word,
                                                                                                           answer_word))

        if self.answer != self.article_title:
            for word in words:
                if len(word) > 2 and word not in self.exception_word:
                    if word not in delimiters_prefixes and word not in delimiters_postfixes \
                            and word != white_space_replacer:
                        for answer_word in self.article_title.split():
                            distances_to_right_answer[word] = min(distances_to_right_answer[word],
                                                                  self.edit_distance_service.edit_distance(word,
                                                                                                           answer_word))

        distances_values_keys = [k for k, v in sorted(distances_to_right_answer.items(), key=lambda item: item[1])]
        distances_values_keys = distances_values_keys[:max(len(distances_to_right_answer.keys())//20,
                                                           max(len(self.answer.split()),
                                                               len(self.article_title.split())))]
        summary_censored = []
        for word in words:
            if word not in delimiters_postfixes and word not in delimiters_prefixes and word != white_space_replacer:
                if word not in distances_values_keys:
                    if (word.startswith(self.answer) or self.answer.startswith(word) or \
                            word.startswith(self.article_title) or self.article_title.startswith(word)) \
                            and len(word) > 2 and word not in self.exception_word:
                        summary_censored.append("____")
                    elif word in distances_to_right_answer and distances_to_right_answer[word] <= 1:
                        summary_censored.append("____")
                    else:
                        summary_censored.append(word)
                else:
                    summary_censored.append("____")
            else:
                summary_censored.append(word)
        self.definition = "".join(summary_censored).replace(white_space_replacer, " ")
        return self

    def get_definition(self) -> str:
        return self.definition
