package pl.edu.agh.quizzesthesis.api.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.quizzesthesis.api.dto.CategoryResponse;
import pl.edu.agh.quizzesthesis.business.service.CategoryService;

import java.util.List;

import static pl.edu.agh.quizzesthesis.App.API_URL_PREFIX;

@RestController
@RequestMapping(API_URL_PREFIX + "/categories")
@AllArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponse> getCategories() {
        return categoryService.getCategories();
    }
}
