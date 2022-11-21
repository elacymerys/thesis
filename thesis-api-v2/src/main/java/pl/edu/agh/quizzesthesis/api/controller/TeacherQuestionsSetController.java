package pl.edu.agh.quizzesthesis.api.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.quizzesthesis.business.Current;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;

import static pl.edu.agh.quizzesthesis.App.API_URL_PREFIX;

@RestController
@RequestMapping(API_URL_PREFIX + "/questions-set")
@AllArgsConstructor
public class TeacherQuestionsSetController {

    @GetMapping
    public QuestionsSetResponse getQuestionsSet(@RequestParam(name = "key") String questionsSetKey) {
        return null;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String createQuestionsSet(@Current UserAuthDetails userAuthDetails, @RequestBody QuestionsSetsRequest request) {
        return null;
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuestionsSet(@Current UserAuthDetails userAuthDetails, @RequestBody String questionsSetKey) {
    }

    @GetMapping("/list")
    public List<QuestionsSetNameKeyResponse> getQuestionsSetsNamesAndKeys(@Current UserAuthDetails userAuthDetails) {
        return null;
    }

    @PatchMapping("/refresh-key")
    public String refreshQuestionsSetKey(@Current UserAuthDetails userAuthDetails, @RequestBody String questionsSetKey) {
        return null;
    }
}
