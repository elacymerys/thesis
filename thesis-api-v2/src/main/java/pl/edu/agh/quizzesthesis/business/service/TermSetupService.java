package pl.edu.agh.quizzesthesis.business.service;

import com.szadowsz.datamuse.DatamuseClient;
import com.szadowsz.datamuse.DatamuseException;
import com.szadowsz.datamuse.DatamuseParam;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.business.exception.ExternalServiceException;
import pl.edu.agh.quizzesthesis.data.entity.Category;
import pl.edu.agh.quizzesthesis.data.entity.Term;
import pl.edu.agh.quizzesthesis.data.repository.TermRepository;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.szadowsz.datamuse.DatamuseParam.META_FLAG_F;
import static java.lang.Math.min;

@Service
@AllArgsConstructor
@DependsOn("categorySetupService")
public class TermSetupService {

    private static final int REJECTED_PERCENT = 0;

    private final TermRepository termRepository;
    private final CategoryService categoryService;
    private final DatamuseClient datamuseClient;

    @PostConstruct
    @Transactional
    public void setupAll() {
        categoryService.getAll().forEach(this::setupOne);
    }

    private void setupOne(final Category category) {
        var termsAlreadyPersisted = termRepository.findAllByCategoryId(category.getId());
        if (termsAlreadyPersisted.size() >= 1000) {
            return;
        }

        var termNamesAlreadyPersisted = getTermNamesAlreadyPersisted(termsAlreadyPersisted);
        var termsFromApi = getTermsFromApi(category);

        if (termsFromApi.isEmpty()) {
            return;
        }

        termsFromApi = getItemsTaken(termsFromApi);
        var newTermsFromApi = getNewTermsFromApi(termNamesAlreadyPersisted, termsFromApi);

        if (newTermsFromApi.isEmpty()) {
            return;
        }

        newTermsFromApi = getNewTermsFromApiTaken(termsAlreadyPersisted, newTermsFromApi);
        float maxFrequency = termsFromApi.get(0).frequency();

        termRepository.saveAll(getTermsToSave(category, newTermsFromApi, maxFrequency));
    }

    private List<Term> getTermsToSave(Category category, List<WordFrequency> newTermsFromApi, float maxFrequency) {
        return newTermsFromApi.stream()
                .map(word -> new Term(
                        null,
                        word.word(),
                        word.frequency() / maxFrequency,
                        0L,
                        0L,
                        word.frequency() / maxFrequency,
                        null,
                        null,
                        category
                ))
                .toList();
    }

    private List<WordFrequency> getNewTermsFromApiTaken(Set<Term> termsAlreadyPersisted, List<WordFrequency> newTermsFromApi) {
        return newTermsFromApi.subList(0, min(newTermsFromApi.size(), 1000 - termsAlreadyPersisted.size()));
    }

    private List<WordFrequency> getNewTermsFromApi(Set<String> termNamesAlreadyPersisted, List<WordFrequency> termsFromApi) {
        return termsFromApi.stream()
                .filter(term -> !termNamesAlreadyPersisted.contains(term.word()))
                .toList();
    }

    private List<WordFrequency> getItemsTaken(List<WordFrequency> termsFromApi) {
        int itemsTaken = (int) ((1 - (REJECTED_PERCENT / 100.0)) * termsFromApi.size());
        return termsFromApi.subList(0, itemsTaken);
    }

    private List<WordFrequency> getTermsFromApi(Category category) {
        List<WordFrequency> termsFromApi = null;
        try {
            termsFromApi = datamuseClient.meansLike(
                            category.getSearchWord(),
                            Map.of(
                                    DatamuseParam.Code.MD, META_FLAG_F,
                                    DatamuseParam.Code.MAX, "1000"
                            )
                    ).stream()
                    .filter(word -> word.getTags().contains("n") && !word.getTags().contains("syn"))
                    .map(word -> new WordFrequency(word.getWord(), Float.parseFloat(word.getTags().get(word.getTags().size() - 1).substring(2))))
                    .sorted((wf1, wf2) -> Float.compare(wf2.frequency(), wf1.frequency()))
                    .toList();
        } catch (DatamuseException | IOException e) {
            throw new ExternalServiceException("Cannot load terms from Datamuse", e);
        }
        return termsFromApi;
    }

    private Set<String> getTermNamesAlreadyPersisted(Set<Term> termsAlreadyPersisted) {
        return termsAlreadyPersisted.stream()
                .map(Term::getName)
                .collect(Collectors.toSet());
    }

    public record WordFrequency(String word, float frequency) {}
}
