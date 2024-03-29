package pl.edu.agh.quizzesthesis.business.service;

import com.szadowsz.datamuse.DatamuseClient;
import com.szadowsz.datamuse.DatamuseException;
import com.szadowsz.datamuse.WordResult;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.quizzesthesis.business.exception.ExternalServiceException;
import pl.edu.agh.quizzesthesis.data.entity.Term;

import java.io.IOException;
import java.util.*;

import static com.szadowsz.datamuse.DatamuseParam.Code;
import static com.szadowsz.datamuse.DatamuseParam.META_FLAG_F;

@Service
@AllArgsConstructor
public class WrongAnswerService {

    private static final float ANSWER_CHOICE_PROBABILITY = 0.7f;
    private static final float EDIT_DISTANCE = 2.0f;

    private final DatamuseClient datamuseClient;
    private final Random random;
    private final EditDistanceService editDistanceService;
    private final TermService termService;

    public List<String> prepareAnswers(Term term) {
        var wrongAnswers = getWrongAnswers(term);
        var answers = new ArrayList<String>();
        answers.add(term.getName());
        answers.addAll(wrongAnswers);
        Collections.shuffle(answers);
        return answers;
    }

    private List<String> getWrongAnswers(Term rightAnswerTerm) {
        String rightAnswer = rightAnswerTerm.getName();
        List<WordResult> relatedWords;
        try {
            relatedWords = datamuseClient.meansLike(rightAnswerTerm.getName(), Map.of(Code.MD, META_FLAG_F));
        } catch (DatamuseException | IOException e) {
            throw new ExternalServiceException("Error while querying Datamuse", e);
        }

        var relatedNouns = relatedWords.stream()
                .filter(word -> word.getTags().contains("n") && !word.getTags().contains("syn"))
                .map(word -> new TermSetupService.WordFrequency(word.getWord(), Float.parseFloat(word.getTags().get(word.getTags().size() - 1).substring(2))))
                .toList();


        var wrongAnswers = new ArrayList<String>();
        for (var potentialAnswer : relatedNouns) {
            if (wrongAnswers.size() == 3) {
                break;
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
            if (!termService.existsOfCategory(potentialAnswer.word(),
                    rightAnswerTerm.getSearchPhrase().getCategory().getId())) {
                continue;
            }
            if (!stop) {
                wrongAnswers.add(potentialAnswer.word());
            }
        }

        if (wrongAnswers.size() < 3) {
            for (var potentialAnswer : relatedNouns) {
                if (wrongAnswers.size() == 3) {
                    break;
                }
                if (!wrongAnswers.contains(potentialAnswer.word())) {
                    wrongAnswers.add(potentialAnswer.word());
                }
            }
        }
        while (wrongAnswers.size() < 3) {
            var potentialAnswer = termService.getWithDifficulty(
                    rightAnswerTerm.getSearchPhrase().getCategory().getId(), 0.5f);
            if (!wrongAnswers.contains(potentialAnswer.getName())) {
                wrongAnswers.add(potentialAnswer.getName());
            }
        }
        return wrongAnswers;
    }
}
