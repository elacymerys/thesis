package pl.edu.agh.quizzesthesis.business;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import pl.edu.agh.quizzesthesis.business.exception.NotFoundException;
import pl.edu.agh.quizzesthesis.data.TermRepository;
import pl.edu.agh.quizzesthesis.data.entity.Term;

import java.util.Random;

@Service
@AllArgsConstructor
public class TermService {

    private static final int REJECTED_PERCENT = 0;
    private static final float DIFFICULTY_LEVEL_SPAN_INCREASE = 0.1f;
    private static final float DIFFICULTY_LEVEL_STARTING_SPAN = 0.1f;

    private static final int SINGLE_TERM_PAGE_SIZE = 1;

    private final TermRepository termRepository;
    private final Random random;

    public Term getRandom(int categoryId) {
        int termCounter = (int) termRepository.count();
        if (termCounter == 0) {
            throw new NotFoundException("There are no terms for category %d".formatted(categoryId));
        }

        int randomTerm = random.nextInt(termCounter);
        var page = termRepository.findAll(PageRequest.of(randomTerm, SINGLE_TERM_PAGE_SIZE));
        return page.getContent().get(0);
    }

    public boolean existsOfCategory(String termName, int categoryId) {
        return termRepository.existsByNameAndCategoryId(termName, categoryId);
    }
}
