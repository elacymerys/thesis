package pl.edu.agh.quizzesthesis.api.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.quizzesthesis.api.dto.*;
import pl.edu.agh.quizzesthesis.business.Current;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;
import pl.edu.agh.quizzesthesis.business.service.TeacherQuestionsSetService;

import java.util.List;

import static pl.edu.agh.quizzesthesis.App.API_URL_PREFIX;

@RestController
@RequestMapping(API_URL_PREFIX + "/questions-sets")
@AllArgsConstructor
public class TeacherQuestionsSetController {
    private final TeacherQuestionsSetService teacherQuestionsSetService;

    @GetMapping("/{key}")
    public QuestionsSetResponse getQuestionsSet(@PathVariable(name = "key") String questionsSetKey) {
        return teacherQuestionsSetService.getQuestionsSet(questionsSetKey);
    }

    @PutMapping("/{key}")
    @ResponseStatus(HttpStatus.OK)
    public QuestionsSetKeyResponse updateQuestionsSet(@Current UserAuthDetails userAuthDetails,
                                                      @PathVariable(name = "key") String questionsSetKey,
                                                      @RequestBody QuestionsSetsRequest request) {
        return teacherQuestionsSetService.updateQuestionsSet(userAuthDetails, questionsSetKey, request);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionsSetKeyResponse createQuestionsSet(@Current UserAuthDetails userAuthDetails,
                                                      @RequestBody QuestionsSetsRequest request) {
        return teacherQuestionsSetService.createQuestionsSet(userAuthDetails, request);
    }

    @DeleteMapping("/{key}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuestionsSet(@Current UserAuthDetails userAuthDetails,
                                   @PathVariable(name = "key") String questionsSetKey) {
        teacherQuestionsSetService.deleteQuestionsSet(userAuthDetails, questionsSetKey);
    }

    @GetMapping
    public List<QuestionsSetNameKeySizeResponse> getQuestionsSetsNamesAndKeys(@Current UserAuthDetails userAuthDetails) {
        return teacherQuestionsSetService.getQuestionsSetsNamesKeysAndSizes(userAuthDetails);
    }

    @PatchMapping("/refresh-key")
    public QuestionsSetKeyResponse refreshQuestionsSetKey(@Current UserAuthDetails userAuthDetails,
                                                          @RequestBody QuestionsSetKeyRequest request) {
        return teacherQuestionsSetService.refreshQuestionsSetKey(userAuthDetails, request.questionsSetKey());
    }
}
