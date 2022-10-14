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
import pl.edu.agh.quizzesthesis.data.entity.User;
import pl.edu.agh.quizzesthesis.data.repository.CategoryRepository;
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
public class CategorySetupService {

    private static final String CATEGORIES_FILE_PATH = "categories.txt";

    private final CategoryRepository categoryRepository;
    private final TermRepository termRepository;
    private final UserRepository userRepository;

    @PostConstruct
    @Transactional
    public void setUp() {
        CSVParser parser = new CSVParserBuilder().withSeparator(';').build();
        try (
                var reader = new BufferedReader(new InputStreamReader(new ClassPathResource(CATEGORIES_FILE_PATH).getInputStream()));
                CSVReader csvReader = buildCsvReader(parser, reader)
        ) {
            var categoriesAlreadyPersisted = getCategoriesAlreadyPersisted();
            var categoriesInFile = getCategoriesInFile(csvReader);
            var categoriesToPersist = getCategoriesToPersist(categoriesAlreadyPersisted, categoriesInFile);
            var categoriesToUpdate = getCategoriesToUpdate(categoriesAlreadyPersisted, categoriesInFile);
            var categoriesToRemove = getCategoriesToRemove(categoriesAlreadyPersisted, categoriesInFile);

            var newCategoriesPersisted = updateCategories(categoriesToPersist, categoriesToUpdate);

            updateUsers(categoriesToRemove, newCategoriesPersisted);

            cleanUpCategoriesAndTerms(categoriesToRemove);
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

    private void cleanUpCategoriesAndTerms(List<Category> categoriesToRemove) {
        categoriesToRemove.forEach(termRepository::deleteAllByCategory);
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

    private List<Category> getCategoriesToRemove(Map<String, Category> categoriesAlreadyPersisted, List<Category> categoriesInFile) {
        return categoriesAlreadyPersisted.values().stream()
                .filter(category -> !categoriesInFile.contains(category))
                .toList();
    }

    private List<Category> getCategoriesToUpdate(Map<String, Category> categoriesAlreadyPersisted, List<Category> categoriesInFile) {
        return categoriesInFile.stream()
                .filter(category -> categoriesAlreadyPersisted.containsKey(category.getName()))
                .peek(category -> category.setId(categoriesAlreadyPersisted.get(category.getName()).getId()))
                .toList();
    }

    private List<Category> getCategoriesToPersist(Map<String, Category> categoriesAlreadyPersisted, List<Category> categoriesInFile) {
        return categoriesInFile.stream()
                .filter(category -> !categoriesAlreadyPersisted.containsKey(category.getName()))
                .toList();
    }

    private List<Category> getCategoriesInFile(CSVReader csvReader) throws IOException, CsvException {
        return csvReader.readAll().stream()
                .map(categoryRow -> new Category(null, categoryRow[0], categoryRow[1]))
                .toList();
    }

    private Map<String, Category> getCategoriesAlreadyPersisted() {
        return categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getName, category -> category));
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
