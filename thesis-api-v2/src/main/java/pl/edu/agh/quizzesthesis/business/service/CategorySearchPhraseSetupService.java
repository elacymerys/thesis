package pl.edu.agh.quizzesthesis.business.service;

import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import lombok.AllArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.business.exception.InternalServiceException;
import pl.edu.agh.quizzesthesis.data.entity.Category;
import pl.edu.agh.quizzesthesis.data.entity.SearchPhrase;
import pl.edu.agh.quizzesthesis.data.entity.User;
import pl.edu.agh.quizzesthesis.data.repository.CategoryRepository;
import pl.edu.agh.quizzesthesis.data.repository.SearchPhraseRepository;
import pl.edu.agh.quizzesthesis.data.repository.TermRepository;
import pl.edu.agh.quizzesthesis.data.repository.UserRepository;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategorySearchPhraseSetupService {

    private static final String CATEGORIES_FILE_PATH = "categories.txt";
    private static final String SEARCH_PHRASE_FILE_PATH = "search_phrases.txt";

    private final CategoryRepository categoryRepository;
    private final TermRepository termRepository;
    private final SearchPhraseRepository searchPhraseRepository;
    private final UserRepository userRepository;

    @PostConstruct
    @Transactional
    public void setUp() {
        CSVParser parser = new CSVParserBuilder().withSeparator(';').build();
        try (
                var categoryReader = new BufferedReader(new InputStreamReader(new ClassPathResource(CATEGORIES_FILE_PATH).getInputStream()));
                CSVReader categoryCsvReader = buildCsvReader(parser, categoryReader);
                var searchPhraseReader = new BufferedReader(new InputStreamReader(new ClassPathResource(SEARCH_PHRASE_FILE_PATH).getInputStream()));
                CSVReader searchPhraseCsvReader = buildCsvReader(parser, searchPhraseReader)
        ) {
            var categoriesAlreadyPersisted = getCategoriesAlreadyPersisted();
            var searchPhrasesAlreadyPersisted = getSearchPhrasesAlreadyPersisted();
            var categoriesInFile = getCategoriesInFile(categoryCsvReader);
            var categoriesToPersist = getCategoriesToPersist(categoriesAlreadyPersisted, categoriesInFile);
            var categoriesToUpdate = getCategoriesToUpdate(categoriesAlreadyPersisted, categoriesInFile);
            var categoriesToRemove = getCategoriesToRemove(categoriesAlreadyPersisted, categoriesInFile);
            var newCategoriesPersisted = updateCategories(categoriesToPersist, categoriesToUpdate);

            var searchPhrasesInFile = getSearchPhrasesInFile(searchPhraseCsvReader);
            var searchPhrasesToPersist = getSearchPhrasesToPersist(searchPhrasesAlreadyPersisted, searchPhrasesInFile);
            var searchPhrasesToUpdate = getSearchPhrasesToUpdate(searchPhrasesAlreadyPersisted, searchPhrasesInFile);
            var searchPhrasesToRemove = getSearchPhrasesToRemove(searchPhrasesAlreadyPersisted, searchPhrasesInFile);

            updateSearchPhrases(searchPhrasesToPersist, searchPhrasesToUpdate);


            updateUsers(categoriesToRemove, newCategoriesPersisted);
            cleanUpCategoriesAndTerms(categoriesToRemove, searchPhrasesToRemove);
        } catch (IOException | CsvException e) {
            throw new InternalServiceException("Cannot read categories file", e);
        }
    }


    private CSVReader buildCsvReader(CSVParser parser, BufferedReader reader) {
        return new CSVReaderBuilder(reader)
                .withSkipLines(1)
                .withCSVParser(parser)
                .build();
    }

    private void cleanUpCategoriesAndTerms(List<Category> categoriesToRemove, List<SearchPhrase> searchPhrasesToRemove) {
        searchPhrasesToRemove.forEach(termRepository::deleteAllBySearchPhrase);
        categoriesToRemove.forEach(termRepository::deleteAllByCategory);
        categoriesToRemove.forEach(searchPhraseRepository::deleteAllByCategory);
        searchPhraseRepository.deleteAll(searchPhrasesToRemove);
        categoryRepository.deleteAll(categoriesToRemove);
    }

    private void updateUsers(List<Category> categoriesToRemove, Iterable<Category> newCategoriesPersisted) {
        var users = userRepository.findAll().stream()
                .peek(user -> addUserRanks(user, newCategoriesPersisted))
                .peek(user -> removeUserRanks(user, categoriesToRemove))
                .toList();
        userRepository.saveAll(users);
    }

    private Iterable<Category> updateCategories(List<Category> categoriesToPersist, List<Category> categoriesToUpdate) {
        categoryRepository.saveAll(categoriesToUpdate);
        return categoryRepository.saveAll(categoriesToPersist);
    }

    private void updateSearchPhrases(List<SearchPhrase> searchPhrasesToPersist, List<SearchPhrase> searchPhrasesToUpdate) {
        searchPhraseRepository.saveAll(searchPhrasesToUpdate);
        searchPhraseRepository.saveAll(searchPhrasesToPersist);
    }

    private List<Category> getCategoriesToRemove(Map<String, Category> categoriesAlreadyPersisted, List<Category> categoriesInFile) {
        return categoriesAlreadyPersisted.values().stream()
                .filter(category -> !categoriesInFile.contains(category))
                .toList();
    }

    private List<Category> getCategoriesToUpdate(Map<String, Category> categoriesAlreadyPersisted, List<Category> categoriesInFile) {
        return categoriesInFile.stream()
                .filter(category -> categoriesAlreadyPersisted.containsKey(category.getName()))
                .peek(category -> category.setId
                        (categoriesAlreadyPersisted.get(category.getName()).getId()))
                .toList();
    }

    private List<Category> getCategoriesToPersist(Map<String, Category> categoriesAlreadyPersisted, List<Category> categoriesInFile) {
        return categoriesInFile.stream()
                .filter(category -> !categoriesAlreadyPersisted.containsKey(category.getName()))
                .toList();
    }

    private List<Category> getCategoriesInFile(CSVReader csvReader) throws IOException, CsvException {
        return csvReader.readAll().stream()
                .map(categoryRow -> new Category(null, categoryRow[0]))
                .toList();
    }

    private Map<String, Category> getCategoriesAlreadyPersisted() {
        return categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getName, category -> category));
    }

    private Map<String, SearchPhrase> getSearchPhrasesAlreadyPersisted() {
        return searchPhraseRepository.findAll().stream()
                .collect(Collectors.toMap(SearchPhrase::getSearchWord, searchPhrase -> searchPhrase));
    }

    private List<SearchPhrase> getSearchPhrasesToRemove(Map<String, SearchPhrase> searchPhraseAlreadyPersisted, List<SearchPhrase> searchPhraseInFile) {
        return searchPhraseAlreadyPersisted.values().stream()
                .filter(searchPhrase -> !searchPhraseInFile.contains(searchPhrase))
                .toList();
    }

    private List<SearchPhrase> getSearchPhrasesToUpdate(Map<String, SearchPhrase> searchPhrasesAlreadyPersisted, List<SearchPhrase> searchPhrasesInFile) {
        return searchPhrasesInFile.stream()
                .filter(searchPhrase -> searchPhrasesAlreadyPersisted.containsKey(searchPhrase.getSearchWord()))
                .peek(searchPhrase ->
                        searchPhrase.setId(searchPhrasesAlreadyPersisted.get
                                (searchPhrase.getSearchWord()).getId()))
                .toList();
    }

    private List<SearchPhrase> getSearchPhrasesToPersist(Map<String, SearchPhrase> searchPhrasesAlreadyPersisted, List<SearchPhrase> searchPhrasesInFile) {
        return searchPhrasesInFile.stream()
                .filter(searchPhrase -> !searchPhrasesAlreadyPersisted.containsKey(searchPhrase.getSearchWord()))
                .toList();
    }

    private List<SearchPhrase> getSearchPhrasesInFile(CSVReader csvReader) throws IOException, CsvException {
        var allCategories = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getName, category -> category));
        return csvReader.readAll().stream()
                .map(searchPhraseRow ->
                        new SearchPhrase
                                (null, searchPhraseRow[1],
                                        Integer.valueOf(searchPhraseRow[2]),
                                        allCategories.get(searchPhraseRow[0]))
                ).toList();
    }

    private void addUserRanks(User user, Iterable<Category> categoriesPersisted) {
        categoriesPersisted.forEach(category -> user.getCategoryRanks().put(category, 0.0f));
        categoriesPersisted.forEach(category -> user.getCorrectAnswersCounter().put(category, 0L));
        categoriesPersisted.forEach(category -> user.getTotalAnswersCounter().put(category, 0L));
    }

    private void removeUserRanks(User user, List<Category> categoriesToRemove) {
        categoriesToRemove.forEach(category -> user.getCategoryRanks().remove(category));
        categoriesToRemove.forEach(category -> user.getCorrectAnswersCounter().remove(category));
        categoriesToRemove.forEach(category -> user.getTotalAnswersCounter().remove(category));
    }
}
