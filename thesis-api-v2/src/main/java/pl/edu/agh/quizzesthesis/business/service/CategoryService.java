package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.CategoryResponse;
import pl.edu.agh.quizzesthesis.business.mapper.CategoryMapper;
import pl.edu.agh.quizzesthesis.data.entity.Category;
import pl.edu.agh.quizzesthesis.data.repository.CategoryRepository;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional
    public List<CategoryResponse> getCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::entityToResponse)
                .toList();
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getById(int categoryId) {
        return categoryRepository.findById(categoryId);
    }
}
