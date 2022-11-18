package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.AnswerRequest;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;

@Service
@AllArgsConstructor
public class AnswerService {

    private final TermService termService;
    private final UserService userService;

    @Transactional
    public void answerQuestion(UserAuthDetails userAuthDetails, AnswerRequest answerRequest) {
        var term = termService.updateTermDifficulty(answerRequest.termId(), answerRequest.answerCorrect());
        userService.updateUserRank(userAuthDetails, term, answerRequest.answerCorrect());
    }
}
