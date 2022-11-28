package pl.edu.agh.quizzesthesis.api.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.quizzesthesis.api.dto.AnswerRequest;
import pl.edu.agh.quizzesthesis.business.Current;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;
import pl.edu.agh.quizzesthesis.business.service.AnswerService;

import static pl.edu.agh.quizzesthesis.App.API_URL_PREFIX;

@RestController
@RequestMapping(API_URL_PREFIX + "/answers")
@AllArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    @PostMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void answerQuestion(@Current UserAuthDetails userAuthDetails, @RequestBody AnswerRequest request) {
        answerService.answerQuestion(userAuthDetails, request);
    }
}
