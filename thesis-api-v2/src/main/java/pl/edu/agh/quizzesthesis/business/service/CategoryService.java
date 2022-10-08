package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.CategoryResponse;
import pl.edu.agh.quizzesthesis.business.mapper.CategoryMapper;
import pl.edu.agh.quizzesthesis.data.repository.CategoryRepository;
import pl.edu.agh.quizzesthesis.data.entity.Category;

import java.util.List;

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
}
