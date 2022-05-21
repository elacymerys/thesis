from abc import ABC, abstractmethod
import wikipedia as wikipedia


class DefinitionService(ABC):
    @abstractmethod
    def get_definition(self, word: str) -> str:
        pass


class WikipediaDefinitionService(DefinitionService):
    def get_definition(self, term_to_find: str) -> tuple[str, str]:
        word = wikipedia.search(term_to_find)[0]

        try:
            summary = wikipedia.summary(word, auto_suggest=False, redirect=True)
        except wikipedia.DisambiguationError as e:
            summary = wikipedia.summary(e.options[0], auto_suggest=False)
        if len(summary.split('\n')[0]) < 200:
            return "\n".join(summary.split('\n')[0:2]), word
        else:
            return summary.split('\n')[0], word
