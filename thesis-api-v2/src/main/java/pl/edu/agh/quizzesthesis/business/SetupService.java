package pl.edu.agh.quizzesthesis.business;

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
import pl.edu.agh.quizzesthesis.data.CategoryRepository;
import pl.edu.agh.quizzesthesis.data.TermRepository;
import pl.edu.agh.quizzesthesis.data.UserRepository;
import pl.edu.agh.quizzesthesis.data.entity.Category;
import pl.edu.agh.quizzesthesis.data.entity.User;

import javax.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SetupService {

    private static final String CATEGORIES_FILE_PATH = "categories.txt";

    private final CategoryRepository categoryRepository;
    private final TermRepository termRepository;
    private final UserRepository userRepository;

    @PostConstruct
    @Transactional
    public void setUp() {
        var categoriesAlreadyPersisted = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getName, category -> category));

        CSVParser parser = new CSVParserBuilder().withSeparator(';').build();
        try (

                var reader = new BufferedReader(new InputStreamReader(new ClassPathResource(CATEGORIES_FILE_PATH).getInputStream()));
                CSVReader csvReader = new CSVReaderBuilder(reader)
                        .withSkipLines(1)
                        .withCSVParser(parser)
                        .build()
        ) {
            var categoriesInFile = csvReader.readAll().stream()
                    .map(categoryRow -> new Category(null, categoryRow[0], categoryRow[1]))
                    .toList();

            var categoriesToPersist = categoriesInFile.stream()
                    .filter(category -> !categoriesAlreadyPersisted.containsKey(category.getName()))
                    .toList();

            var categoriesToUpdate = categoriesInFile.stream()
                    .filter(category -> categoriesAlreadyPersisted.containsKey(category.getName()))
                    .peek(category -> category.setId(categoriesAlreadyPersisted.get(category.getName()).getId()))
                    .toList();

            var categoriesToRemove = categoriesAlreadyPersisted.values().stream()
                    .filter(category -> !categoriesInFile.contains(category))
                    .toList();

            categoryRepository.saveAll(categoriesToUpdate);
            var categoriesPersisted = categoryRepository.saveAll(categoriesToPersist);

            var users = userRepository.findAll().stream()
                    .peek(user -> addUserRanks(user, categoriesPersisted))
                    .peek(user -> removeUserRanks(user, categoriesToRemove))
                    .toList();
            userRepository.saveAll(users);

            categoriesToRemove.forEach(termRepository::deleteAllByCategory);
            categoryRepository.deleteAll(categoriesToRemove);

        } catch (IOException | CsvException e) {
            throw new InternalServiceException("Cannot read categories file", e);
        }
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
