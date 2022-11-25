package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;

@AllArgsConstructor
public abstract class QuestionService<T> {

    private final UserService userService;

    @Transactional
    public abstract T generateQuestion(int categoryId, UserAuthDetails userAuthDetails);

    protected float getUserRankInCategory(UserAuthDetails userAuthDetails, int categoryId) {
        return userService.getUser(userAuthDetails.id())
                .categoryRanks().get(categoryId);
    }
}
