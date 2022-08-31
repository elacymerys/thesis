package pl.edu.agh.quizzesthesis.business;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.quizzesthesis.api.dto.QuestionResponse;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static java.lang.Math.max;
import static java.lang.Math.min;

@Service
@AllArgsConstructor
public class DefinitionProcessingService {

    private static final Set<String> EXCEPTIONAL_WORDS = Set.of(
            "the", "and", "are", "for", "not", "but", "had", "has", "was", "all", "any", "one", "man", "out", "you",
            "his", "her", "can"
    );
    private static final Set<String> DELIMITER_POSTFIXES = Set.of(",", ".", "!", "?", ")", ";", "]");
    private static final Set<String> DELIMITER_PREFIXES = Set.of("(", "[");
    private static final String WHITE_SPACE_REPLACER = "###";
    private static final int LINE_LENGTH = 120;
    private static final int DEFINITION_LENGTH = 300;

    private final EditDistanceService editDistanceService;

    public DefinitionProcessing startProcessing(String definition, String answer, String articleTitle) {
        return new DefinitionProcessing(definition, answer, articleTitle);
    }

    public class DefinitionProcessing {

        private final String definition;
        private final String answer;
        private final String articleTitle;

        private DefinitionProcessing(String definition, String answer, String articleTitle) {
            this.definition = definition;
            this.answer = answer;
            this.articleTitle = articleTitle;
        }

        public String getDefinition() {
            return definition;
        }

        public DefinitionProcessing standardizeDefinitionLength() {
            String[] definitionSplit = definition.split("\\.");
            int currentDefinitionLength = 0;
            var definitionList = new ArrayList<String>();
            for (String sentence : definitionSplit) {
                if (currentDefinitionLength + sentence.length() < DEFINITION_LENGTH || definitionList.size() == 0) {
                    definitionList.add(sentence);
                    currentDefinitionLength += sentence.length();
                } else {
                    break;
                }
            }
            return new DefinitionProcessing(String.join(".", definitionList) + ".", answer, articleTitle);
        }

        public DefinitionProcessing removeAnswerFromDefinition() {
            String text = definition;
            if (text.charAt(text.length() - 2) == '.') {
                text = text.substring(0, text.length() - 1);
            }
            text = text.replace("  ", " ");
            text = text.replace(" ", " " + WHITE_SPACE_REPLACER + " ");

            for (String delimiter : DELIMITER_POSTFIXES) {
                text = text.replace(delimiter, " " + delimiter);
            }
            for (String delimiter : DELIMITER_POSTFIXES) {
                text = text.replace(delimiter, delimiter + " ");
            }
            for (String delimiter : DELIMITER_POSTFIXES) {
                text = text.replace(delimiter + "  ", delimiter + "&&&");
            }
            for (String delimiter : DELIMITER_POSTFIXES) {
                text = text.replace(delimiter + " ", delimiter + " " + WHITE_SPACE_REPLACER + " ");
            }
            for (String delimiter : DELIMITER_POSTFIXES) {
                text = text.replace(delimiter + "&&&", delimiter + " ");
            }
            for (String delimiter : DELIMITER_PREFIXES) {
                text = text.replace(delimiter, delimiter + " ");
            }
            for (String delimiter : DELIMITER_PREFIXES) {
                text = text.replace(delimiter, " " + delimiter);
            }
            for (String delimiter : DELIMITER_PREFIXES) {
                text = text.replace("  " + delimiter, "&&&" + delimiter);
            }
            for (String delimiter : DELIMITER_PREFIXES) {
                text = text.replace(" " + delimiter, " " + WHITE_SPACE_REPLACER + " " + delimiter);
            }
            for (String delimiter : DELIMITER_PREFIXES) {
                text = text.replace("&&&" + delimiter, " " + delimiter);
            }

            String[] words = Arrays.stream(text.split("\s"))
                    .toArray(String[]::new);

            var distancesToRightAnswer = new HashMap<String, Float>();
            for (String word : words) {
                if (!DELIMITER_PREFIXES.contains(word) && !DELIMITER_POSTFIXES.contains(word) && !word.equals(WHITE_SPACE_REPLACER)) {
                    if (word.length() > 2 && !EXCEPTIONAL_WORDS.contains(word)) {
                        for (String answerWord : answer.split("\s")) {
                            if (!distancesToRightAnswer.containsKey(word)) {
                                distancesToRightAnswer.put(word, editDistanceService.editDistance(word, answerWord));
                            } else {
                                distancesToRightAnswer.put(
                                        word,
                                        min(
                                                distancesToRightAnswer.get(word),
                                                editDistanceService.editDistance(word, answerWord)
                                        )
                                );
                            }
                        }
                    }
                }
            }

            if (!answer.equalsIgnoreCase(articleTitle)) {
                for (String word : words) {
                    if (word.length() > 2 && !EXCEPTIONAL_WORDS.contains(word)) {
                        if (!DELIMITER_PREFIXES.contains(word) && !DELIMITER_POSTFIXES.contains(word) && !word.equals(WHITE_SPACE_REPLACER)) {
                            for (String answerInTitle : articleTitle.split("\s")) {
                                distancesToRightAnswer.put(
                                        word,
                                        min(
                                                distancesToRightAnswer.get(word),
                                                editDistanceService.editDistance(word, answerInTitle)
                                        )
                                );
                            }
                        }
                    }
                }
            }

           var distanceValueKeys = distancesToRightAnswer.entrySet().stream()
                    .sorted((a, b) -> Float.compare(a.getValue(), b.getValue()))
                    .limit(limitDistanceValueKeys(distancesToRightAnswer))
                    .map(Map.Entry::getKey)
                    .toList();

            var summaryCensored = new ArrayList<String>();
            for (String word : words) {
                if (!DELIMITER_POSTFIXES.contains(word) && !DELIMITER_PREFIXES.contains(word) && !word.equals(WHITE_SPACE_REPLACER)) {
                    if (!distanceValueKeys.contains(word)) {
                        if (word.startsWith(answer) || answer.startsWith(word) ||
                                word.startsWith(articleTitle) || articleTitle.startsWith(word) &&
                                word.length() > 2 && !EXCEPTIONAL_WORDS.contains(word)) {
                            summaryCensored.add("____");
                        } else if (distancesToRightAnswer.containsKey(word) && distancesToRightAnswer.get(word) <= 1) {
                            summaryCensored.add("____");
                        } else {
                            summaryCensored.add(word);
                        }
                    } else {
                        summaryCensored.add("____");
                    }
                } else {
                    summaryCensored.add(word);
                }
            }
            String newDefinition = String.join("", summaryCensored).replace(WHITE_SPACE_REPLACER, " ");
            return new DefinitionProcessing(newDefinition, answer, articleTitle);
        }

        private int limitDistanceValueKeys(Map<String, Float> distancesToRightAnswer) {
            return max(
                    distancesToRightAnswer.size() / 20,
                    max(answer.split("\s").length, articleTitle.split("\s").length)
            );
        }
    }
}
