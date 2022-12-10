package pl.edu.agh.quizzesthesis.business.mapper;

import org.springframework.stereotype.Component;
import pl.edu.agh.quizzesthesis.api.dto.UserResponse;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;
import pl.edu.agh.quizzesthesis.data.entity.Category;
import pl.edu.agh.quizzesthesis.data.entity.User;

import java.util.Map;

import static java.util.stream.Collectors.toMap;

@Component
public class UserMapper {

    public UserResponse entityToResponse(User entity) {
        return new UserResponse(
                entity.getId(),
                entity.getNick(),
                entity.getEmail(),
                collectStatsByCategoryId(entity.getCategoryRanks()),
                collectStatsByCategoryId(entity.getTotalAnswersCounter())
        );
    }

    public UserAuthDetails entityToAuthDetails(User entity) {
        return new UserAuthDetails(entity.getId(), entity.getNick());
    }

    private static <T> Map<Integer, T> collectStatsByCategoryId(Map<Category, T> userStats) {
        return userStats.entrySet().stream()
                .collect(toMap(category -> category.getKey().getId(), Map.Entry::getValue));
    }
}
