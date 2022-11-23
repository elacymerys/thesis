package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.UserResponse;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;
import pl.edu.agh.quizzesthesis.business.exception.UnknownUserException;
import pl.edu.agh.quizzesthesis.business.mapper.UserMapper;
import pl.edu.agh.quizzesthesis.data.entity.Category;
import pl.edu.agh.quizzesthesis.data.entity.Term;
import pl.edu.agh.quizzesthesis.data.repository.UserRepository;

@Service
@AllArgsConstructor
public class UserService {

    public static final float INITIAL_USER_RANK = 0.5f;
    private static final int INITIAL_USER_RANK_WEIGHT = 30;

    private final UserRepository userRepository;
    private final UserMapper mapper;

    @Transactional
    public UserResponse getUser(int id) {
        var user = userRepository.findById(id).orElseThrow(() -> new UnknownUserException("Cannot find user by id " + id));
        return mapper.entityToResponse(user);
    }

    @Transactional
    public void updateUserRankInCategory(UserAuthDetails userAuthDetails, Category category, boolean isAnswerCorrect) {
        var user = userRepository.findById(userAuthDetails.id())
                .orElseThrow(() -> new UnknownUserException("Cannot find user with id %d".formatted(userAuthDetails.id())));

        long totalAnswersCounter = user.getTotalAnswersCounter().get(category) + 1;
        long correctAnswersCounter = user.getCorrectAnswersCounter().get(category) + (isAnswerCorrect ? 1 : 0);

        user.getTotalAnswersCounter().put(category, totalAnswersCounter);
        user.getCorrectAnswersCounter().put(category, correctAnswersCounter);

        user.getCategoryRanks().put(
                category,
                (INITIAL_USER_RANK * INITIAL_USER_RANK_WEIGHT + correctAnswersCounter) / (INITIAL_USER_RANK_WEIGHT + totalAnswersCounter)
        );

        userRepository.save(user);
    }
}
