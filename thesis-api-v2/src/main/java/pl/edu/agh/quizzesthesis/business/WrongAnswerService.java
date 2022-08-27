package pl.edu.agh.quizzesthesis.business;

import com.szadowsz.datamuse.DatamuseClient;
import com.szadowsz.datamuse.DatamuseException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.quizzesthesis.data.entity.Term;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

import static com.szadowsz.datamuse.DatamuseParam.*;

@Service
@AllArgsConstructor
public class WrongAnswerService {

    private static final float FREQUENCY_THRESHOLD = 0.25f;
    private static final float ANSWER_CHOICE_PROBABILITY = 0.7f;
    private static final float EDIT_DISTANCE = 2.0f;

    private final DatamuseClient datamuseClient;
    private final Random random;
    private final EditDistanceService editDistanceService;
    private final TermService termService;

    public List<String> getWrongAnswers(Term rightAnswerTerm) throws DatamuseException, IOException {
        String rightAnswer = rightAnswerTerm.getName();
        var relatedWords = datamuseClient.meansLike(rightAnswerTerm.getName(), Map.of(Code.MD, META_FLAG_F));
        var relatedNounsSorted = relatedWords.stream()
                .filter(word -> word.getTags().contains("n") && !word.getTags().contains("syn"))
                .map(word -> new WordFrequency(word.getWord(), Float.parseFloat(word.getTags().get(word.getTags().size() - 1).substring(2))))
                .sorted((wf1, wf2) -> Float.compare(wf1.frequency, wf2.frequency))
                .toList();

        float minimumFrequencyThreshold = relatedNounsSorted.size() > 0
                ? relatedNounsSorted.get((int) (relatedNounsSorted.size() * FREQUENCY_THRESHOLD)).frequency
                : 0;

        var wrongAnswers = new ArrayList<String>();
        for (var potentialAnswer : relatedNounsSorted) {
            if (wrongAnswers.size() == 3) {
                break;
            }
            if (potentialAnswer.frequency < minimumFrequencyThreshold) {
                continue;
            }
            if (random.nextFloat(1.0f) > ANSWER_CHOICE_PROBABILITY) {
                continue;
            }
            if (rightAnswer.contains(potentialAnswer.word) || (potentialAnswer.word.contains(rightAnswer))) {
                continue;
            }
            if (editDistanceService.editDistance(potentialAnswer.word, rightAnswer) < EDIT_DISTANCE) {
                continue;
            }

            boolean stop = false;
            for (String wrongAnswer : wrongAnswers) {
                if (wrongAnswer.contains(potentialAnswer.word) || (potentialAnswer.word.contains(wrongAnswer))) {
                    stop = true;
                    break;
                }
                if (editDistanceService.editDistance(potentialAnswer.word, wrongAnswer) < EDIT_DISTANCE) {
                    stop = true;
                    break;
                }
            }
            if (!termService.existsOfCategory(potentialAnswer.word, rightAnswerTerm.getCategory().getId())){
                continue;
            }
            if (!stop){
                wrongAnswers.add(potentialAnswer.word);
            }
        }

        if (wrongAnswers.size() < 3) {
            for (var potentialAnswer : relatedNounsSorted) {
                if (wrongAnswers.size() == 3) {
                    break;
                }
                if (potentialAnswer.frequency > minimumFrequencyThreshold && !wrongAnswers.contains(potentialAnswer.word)) {
                    wrongAnswers.add(potentialAnswer.word);
                }
            }
        }
        return wrongAnswers;
    }

    private record WordFrequency(String word, float frequency) {}
}
