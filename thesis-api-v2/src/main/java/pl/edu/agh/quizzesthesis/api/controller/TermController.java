package pl.edu.agh.quizzesthesis.api.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.quizzesthesis.business.service.TermService;

import static pl.edu.agh.quizzesthesis.App.API_URL_PREFIX;

@RestController
@RequestMapping(API_URL_PREFIX + "/terms")
@AllArgsConstructor
public class TermController {

    private final TermService termService;

    @PostMapping("/{id}/flags")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void answerQuestion(@PathVariable(name = "id") int termId) {
        termService.flagTerm(termId);
    }
}
