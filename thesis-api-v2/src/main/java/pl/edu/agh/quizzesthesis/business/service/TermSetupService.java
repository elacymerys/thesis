package pl.edu.agh.quizzesthesis.business.service;

import com.szadowsz.datamuse.DatamuseClient;
import com.szadowsz.datamuse.DatamuseException;
import com.szadowsz.datamuse.DatamuseParam;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.business.exception.ExternalServiceException;
import pl.edu.agh.quizzesthesis.data.entity.SearchPhrase;
import pl.edu.agh.quizzesthesis.data.entity.Term;
import pl.edu.agh.quizzesthesis.data.repository.TermRepository;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.szadowsz.datamuse.DatamuseParam.META_FLAG_F;
import static java.lang.Math.min;

@Service
@AllArgsConstructor
@DependsOn("categorySearchPhraseSetupService")
public class TermSetupService {

    private static final int REJECTED_PERCENT = 0;

    private final TermRepository termRepository;
    private final SearchPhraseService searchPhraseService;
    private final DatamuseClient datamuseClient;

    @PostConstruct
    @Transactional
    public void setupAll() {
        searchPhraseService.getAll().forEach(this::setupOne);
    }

    private void setupOne(final SearchPhrase searchPhrase) {
        var numberOfRecords = searchPhrase.getNumberOfRecords();

        var termsAlreadyPersisted = termRepository.findAllByCategoryId(searchPhrase.getCategory().getId());

        var numberOfTermsBySearchPhrase = termRepository.countBySearchPhraseId(searchPhrase.getId());
        if (numberOfTermsBySearchPhrase >= numberOfRecords) {
            return;
        }

        var termNamesAlreadyPersisted = getTermNamesAlreadyPersisted(termsAlreadyPersisted);
        var termsFromApi = getTermsFromApi(searchPhrase);

        if (termsFromApi.isEmpty()) {
            return;
        }

        termsFromApi = getItemsTaken(termsFromApi);
        var newTermsFromApi = getNewTermsFromApi(termNamesAlreadyPersisted, termsFromApi);

        if (newTermsFromApi.isEmpty()) {
            return;
        }

        newTermsFromApi = getNewTermsFromApiTaken(numberOfTermsBySearchPhrase, newTermsFromApi, searchPhrase);
        newTermsFromApi = newTermsFromApi.stream().sorted((wf1, wf2) -> Float.compare(wf2.frequency(), wf1.frequency())).toList();
        List<WordFrequency> termsFromApiChanged = new ArrayList<WordFrequency>();
        var i = 0;
        for (WordFrequency term : newTermsFromApi) {
            termsFromApiChanged.add(new WordFrequency(term.word, (float) i / newTermsFromApi.size()));
            i++;
        }

        termRepository.saveAll(getTermsToSave(searchPhrase, termsFromApiChanged));
    }

    private List<Term> getTermsToSave(SearchPhrase searchPhrase, List<WordFrequency> newTermsFromApi) {
        return newTermsFromApi.stream()
                .map(word -> new Term(
                        null,
                        word.word(),
                        word.frequency(),
                        0L,
                        0L,
                        word.frequency(),
                        null,
                        null,
                        searchPhrase,
                        searchPhrase.getCategory()
                ))
                .toList();
    }

    private List<WordFrequency> getNewTermsFromApiTaken(int numberOfTermsAlreadyPersisted, List<WordFrequency> newTermsFromApi, SearchPhrase searchPhrase) {
        return newTermsFromApi.subList(0, min(newTermsFromApi.size(), searchPhrase.getNumberOfRecords() - numberOfTermsAlreadyPersisted));
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

    private List<WordFrequency> getTermsFromApi(SearchPhrase searchPhrase) {
        List<WordFrequency> termsFromApi;
        try {
            termsFromApi = datamuseClient.meansLike(
                            searchPhrase.getSearchWord(),
                            Map.of(
                                    DatamuseParam.Code.MD, META_FLAG_F,
                                    DatamuseParam.Code.MAX, "1000"
                            )
                    ).stream()
                    .filter(word -> word.getTags().contains("n") && !word.getTags().contains("syn"))
                    .map(word -> new WordFrequency(word.getWord(), Float.parseFloat(word.getTags().get(word.getTags().size() - 1).substring(2))))
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

    public record WordFrequency(String word, float frequency) {
    }
}
