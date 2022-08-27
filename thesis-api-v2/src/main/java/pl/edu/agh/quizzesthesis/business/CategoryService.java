package pl.edu.agh.quizzesthesis.business;

import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.CategoryResponse;
import pl.edu.agh.quizzesthesis.business.exception.InternalServiceException;
import pl.edu.agh.quizzesthesis.business.mapper.CategoryMapper;
import pl.edu.agh.quizzesthesis.data.CategoryRepository;
import pl.edu.agh.quizzesthesis.data.entity.Category;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CategoryService {

    private static final String FILE_PATH = "categories.txt";

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional
    public List<CategoryResponse> getCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::entityToResponse)
                .toList();
    }

    @PostConstruct
    @Transactional
    public void addAll() {
        var categoriesAlreadyPersisted = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getName, category -> category));

        CSVParser parser = new CSVParserBuilder().withSeparator(';').build();
        try (
                var reader = Files.newBufferedReader(Path.of(FILE_PATH));
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
                    .collect(Collectors.toSet());

            categoryRepository.saveAll(categoriesToPersist);
            categoryRepository.saveAll(categoriesToUpdate);
        } catch (IOException | CsvException e) {
            throw new InternalServiceException("Cannot read categories file", e);
        }
    }
}
