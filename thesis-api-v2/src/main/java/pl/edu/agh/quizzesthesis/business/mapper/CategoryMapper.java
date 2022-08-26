package pl.edu.agh.quizzesthesis.business.mapper;

import pl.edu.agh.quizzesthesis.api.dto.CategoryResponse;
import pl.edu.agh.quizzesthesis.data.entity.Category;

public class CategoryMapper {

    public CategoryResponse entityToResponse(Category entity) {
        return new CategoryResponse(entity.getId(), entity.getName());
    }
}
