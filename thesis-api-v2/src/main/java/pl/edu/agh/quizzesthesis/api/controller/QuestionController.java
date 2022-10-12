package pl.edu.agh.quizzesthesis.api.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.quizzesthesis.api.dto.DefinitionQuestionResponse;
import pl.edu.agh.quizzesthesis.api.dto.PictureQuestionResponse;
import pl.edu.agh.quizzesthesis.business.service.QuestionService;

import static pl.edu.agh.quizzesthesis.App.API_URL_PREFIX;

@RestController
@RequestMapping(API_URL_PREFIX + "/categories/{categoryId}")
@AllArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/definition/random")
    public DefinitionQuestionResponse getRandomDefinitionQuestion(@PathVariable int categoryId) {
        return questionService.generateDefinitionQuestion(categoryId, null);
    }

    @GetMapping("/picture/random")
    public PictureQuestionResponse getRandomPictureQuestion(@PathVariable int categoryId) {
        return questionService.generatePictureQuestion(categoryId, null);
    }
}