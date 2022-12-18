package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.TermPictureUpdateRequest;
import pl.edu.agh.quizzesthesis.business.exception.NotFoundException;
import pl.edu.agh.quizzesthesis.data.entity.Term;
import pl.edu.agh.quizzesthesis.data.repository.TermRepository;

import java.util.Random;

@Service
@AllArgsConstructor
public class TermService {

    private static final int INITIAL_DIFFICULTY_WEIGHT = 100;

    private final TermRepository termRepository;
    private final Random random;

    @Transactional
    public Term getWithDifficulty(int categoryId, float difficulty) {
        var termsWithSimilarDifficulty = termRepository.findByCategoryAndDifficulty(categoryId, difficulty);
        int termCounter = termsWithSimilarDifficulty.size();
        if (termCounter == 0) {
            throw new NotFoundException("There are no terms for category %d".formatted(categoryId));
        }

        return termsWithSimilarDifficulty.get(random.nextInt(termCounter));
    }

    public Term updateTermDifficulty(int termId, boolean isAnswerCorrect) {
        var term = getTermOrThrow(termId);

        term.setTotalAnswersCounter(term.getTotalAnswersCounter() + 1);
        if (!isAnswerCorrect) {
            term.setWrongAnswersCounter(term.getWrongAnswersCounter() + 1);
        }

        term.setDifficulty(
                (term.getInitialDifficulty() * INITIAL_DIFFICULTY_WEIGHT + term.getWrongAnswersCounter()) /
                        (INITIAL_DIFFICULTY_WEIGHT + term.getTotalAnswersCounter())
        );

        termRepository.save(term);

        return term;
    }

    @Transactional
    public void updateTermPicture(int termId, TermPictureUpdateRequest request) {
        var term = getTermOrThrow(termId);

        term.setPictureURL(request.pictureURL());
        term.setAuthorName(request.authorName());
        termRepository.save(term);
    }

    @Transactional
    public void flagTerm(int termId) {
        var term = getTermOrThrow(termId);
        term.setFlagCounter(term.getFlagCounter() + 1);
        termRepository.save(term);
    }

    public boolean existsOfCategory(String termName, int categoryId) {
        return termRepository.existsByNameAndCategoryId(termName, categoryId);
    }

    private Term getTermOrThrow(int termId) {
        return termRepository.findById(termId)
                .orElseThrow(() -> new NotFoundException("Cannot find term with id %d".formatted(termId)));
    }
}
