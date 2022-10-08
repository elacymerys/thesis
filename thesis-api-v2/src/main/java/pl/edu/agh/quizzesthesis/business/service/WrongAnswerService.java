package pl.edu.agh.quizzesthesis.business.service;

import com.szadowsz.datamuse.DatamuseClient;
import com.szadowsz.datamuse.DatamuseException;
import com.szadowsz.datamuse.WordResult;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.quizzesthesis.business.exception.ExternalServiceException;
import pl.edu.agh.quizzesthesis.business.service.TermService.WordFrequency;
import pl.edu.agh.quizzesthesis.data.entity.Term;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

import static com.szadowsz.datamuse.DatamuseParam.Code;
import static com.szadowsz.datamuse.DatamuseParam.META_FLAG_F;

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

    public List<String> getWrongAnswers(Term rightAnswerTerm) {
        String rightAnswer = rightAnswerTerm.getName();
        List<WordResult> relatedWords;
        try {
            relatedWords = datamuseClient.meansLike(rightAnswerTerm.getName(), Map.of(Code.MD, META_FLAG_F));
        } catch (DatamuseException | IOException e) {
            throw new ExternalServiceException("Error while querying Datamuse", e);
        }

        var relatedNounsSorted = relatedWords.stream()
                .filter(word -> word.getTags().contains("n") && !word.getTags().contains("syn"))
                .map(word -> new WordFrequency(word.getWord(), Float.parseFloat(word.getTags().get(word.getTags().size() - 1).substring(2))))
                .sorted((wf1, wf2) -> Float.compare(wf1.frequency(), wf2.frequency()))
                .toList();

        float minimumFrequencyThreshold = relatedNounsSorted.size() > 0
                ? relatedNounsSorted.get((int) (relatedNounsSorted.size() * FREQUENCY_THRESHOLD)).frequency()
                : 0;

        var wrongAnswers = new ArrayList<String>();
        for (var potentialAnswer : relatedNounsSorted) {
            if (wrongAnswers.size() == 3) {
                break;
            }
            if (potentialAnswer.frequency() < minimumFrequencyThreshold) {
                continue;
            }
            if (random.nextFloat(1.0f) > ANSWER_CHOICE_PROBABILITY) {
                continue;
            }
            if (rightAnswer.contains(potentialAnswer.word()) || (potentialAnswer.word().contains(rightAnswer))) {
                continue;
            }
            if (editDistanceService.editDistance(potentialAnswer.word(), rightAnswer) < EDIT_DISTANCE) {
                continue;
            }

            boolean stop = false;
            for (String wrongAnswer : wrongAnswers) {
                if (wrongAnswer.contains(potentialAnswer.word()) || (potentialAnswer.word().contains(wrongAnswer))) {
                    stop = true;
                    break;
                }
                if (editDistanceService.editDistance(potentialAnswer.word(), wrongAnswer) < EDIT_DISTANCE) {
                    stop = true;
                    break;
                }
            }
            if (!termService.existsOfCategory(potentialAnswer.word(), rightAnswerTerm.getCategory().getId())){
                continue;
            }
            if (!stop){
                wrongAnswers.add(potentialAnswer.word());
            }
        }

        if (wrongAnswers.size() < 3) {
            for (var potentialAnswer : relatedNounsSorted) {
                if (wrongAnswers.size() == 3) {
                    break;
                }
                if (potentialAnswer.frequency() > minimumFrequencyThreshold && !wrongAnswers.contains(potentialAnswer.word())) {
                    wrongAnswers.add(potentialAnswer.word());
                }
            }
        }
        return wrongAnswers;
    }
}
