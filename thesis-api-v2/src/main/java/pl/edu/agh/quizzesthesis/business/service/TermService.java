package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.TermDifficultyUpdateRequest;
import pl.edu.agh.quizzesthesis.business.exception.NotFoundException;
import pl.edu.agh.quizzesthesis.data.entity.Term;
import pl.edu.agh.quizzesthesis.data.repository.TermRepository;

import java.util.Random;

@Service
@AllArgsConstructor
public class TermService {

    private static final int INITIAL_DIFFICULTY_WEIGHT = 100;
    private static final int SINGLE_TERM_PAGE_SIZE = 1;

    private final TermRepository termRepository;
    private final Random random;

    @Transactional
    public Term getRandom(int categoryId) {
        int termCounter = (int) termRepository.countByCategoryId(categoryId);
        if (termCounter == 0) {
            throw new NotFoundException("There are no terms for category %d".formatted(categoryId));
        }

        int randomTerm = random.nextInt(termCounter);
        var page = termRepository.findPageByCategoryId(
                PageRequest.of(randomTerm, SINGLE_TERM_PAGE_SIZE),
                categoryId
        );
        return page.getContent().get(0);
    }

    @Transactional
    public void updateTermDifficulty(int termId, TermDifficultyUpdateRequest request) {
        var term = termRepository.findById(termId)
                .orElseThrow(() -> new NotFoundException("Cannot find term with id %d".formatted(termId)));

        term.setTotalAnswersCounter(term.getTotalAnswersCounter() + 1);
        if (request.answerCorrect()) {
            term.setCorrectAnswersCounter(term.getCorrectAnswersCounter() + 1);
        }

        term.setDifficulty(
                (term.getInitialDifficulty() * INITIAL_DIFFICULTY_WEIGHT + term.getCorrectAnswersCounter()) /
                        (INITIAL_DIFFICULTY_WEIGHT + term.getTotalAnswersCounter())
        );

        termRepository.save(term);
    }

    public boolean existsOfCategory(String termName, int categoryId) {
        return termRepository.existsByNameAndCategoryId(termName, categoryId);
    }
}
