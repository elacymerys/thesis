package pl.edu.agh.quizzesthesis.business.service;

import com.szadowsz.datamuse.DatamuseClient;
import com.szadowsz.datamuse.DatamuseException;
import com.szadowsz.datamuse.DatamuseParam;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.TermDifficultyUpdateRequest;
import pl.edu.agh.quizzesthesis.business.exception.ExternalServiceException;
import pl.edu.agh.quizzesthesis.business.exception.NotFoundException;
import pl.edu.agh.quizzesthesis.data.entity.Category;
import pl.edu.agh.quizzesthesis.data.entity.Term;
import pl.edu.agh.quizzesthesis.data.repository.TermRepository;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import static com.szadowsz.datamuse.DatamuseParam.META_FLAG_F;
import static java.lang.Math.min;

@Service
@AllArgsConstructor
public class TermService {

    private static final int REJECTED_PERCENT = 0;
    private static final float DIFFICULTY_LEVEL_SPAN_INCREASE = 0.1f;
    private static final float DIFFICULTY_LEVEL_STARTING_SPAN = 0.1f;
    private static final int INITIAL_DIFFICULTY_WEIGHT = 100;
    private static final int SINGLE_TERM_PAGE_SIZE = 1;

    private final TermRepository termRepository;
    private final CategoryService categoryService;
    private final DatamuseClient datamuseClient;
    private final Random random;

    @PostConstruct
    @Transactional
    public void setupAll() {
        categoryService.getAll().forEach(this::setupOne);
    }

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

    private void setupOne(final Category category) {
        int noOfRecords = category.getNoOfRecords();
        var termsAlreadyPersisted = termRepository.findAllByCategoryId(category.getId());
        if (termsAlreadyPersisted.size() >= noOfRecords) {
            return;
        }

        var termNamesAlreadyPersisted = termsAlreadyPersisted.stream()
                .map(Term::getName)
                .collect(Collectors.toSet());

        List<WordFrequency> termsFromApi = null;
        try {
            termsFromApi = datamuseClient.meansLike(
                    category.getSearchWord(),
                    Map.of(
                            DatamuseParam.Code.MD, META_FLAG_F,
                            DatamuseParam.Code.MAX, String.valueOf(noOfRecords)
                    )
            ).stream()
                    .filter(word -> word.getTags().contains("n") && !word.getTags().contains("syn"))
                    .map(word -> new WordFrequency(word.getWord(), Float.parseFloat(word.getTags().get(word.getTags().size() - 1).substring(2))))
                    .toList();
                    // .sorted((wf1, wf2) -> Float.compare(wf2.frequency(), wf1.frequency()))

        } catch (DatamuseException | IOException e) {
            throw new ExternalServiceException("Cannot load terms from Datamuse", e);
        }

        if (termsFromApi.isEmpty()) {
            return;
        }

        int itemsTaken = (int) ((1 - (REJECTED_PERCENT / 100.0)) * termsFromApi.size());
        termsFromApi = termsFromApi.subList(0, itemsTaken);

        var newTermsFromApi = termsFromApi.stream()
                .filter(term -> !termNamesAlreadyPersisted.contains(term.word()))
                .toList();

        if (newTermsFromApi.isEmpty()) {
            return;
        }

        newTermsFromApi = newTermsFromApi.subList(0, min(newTermsFromApi.size(), noOfRecords - termsAlreadyPersisted.size()));
        float maxFrequency = termsFromApi.get(0).frequency();

        var termsToSave = newTermsFromApi.stream()
                .map(word -> new Term(
                        null,
                        word.word(),
                        word.frequency() / maxFrequency,
                        0L,
                        0L,
                        word.frequency() / maxFrequency,
                        category
                ))
                .toList();

        termRepository.saveAll(termsToSave);
    }

    public record WordFrequency(String word, float frequency) {}
}
