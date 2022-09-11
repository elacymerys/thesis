package pl.edu.agh.quizzesthesis.api;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.quizzesthesis.api.dto.QuestionResponse;
import pl.edu.agh.quizzesthesis.business.QuestionService;

import static pl.edu.agh.quizzesthesis.App.API_URL_PREFIX;

@RestController
@RequestMapping(API_URL_PREFIX + "")
@AllArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/categories/{categoryId}/questions")
    public QuestionResponse getRandomQuestion(@PathVariable int categoryId) {
        return questionService.generateQuestion(categoryId);
    }
}
