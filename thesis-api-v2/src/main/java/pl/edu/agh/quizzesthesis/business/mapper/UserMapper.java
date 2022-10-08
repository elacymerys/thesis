package pl.edu.agh.quizzesthesis.business.mapper;

import org.springframework.stereotype.Component;
import pl.edu.agh.quizzesthesis.api.dto.UserResponse;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;
import pl.edu.agh.quizzesthesis.data.entity.User;

import java.util.Map;

import static java.util.stream.Collectors.toMap;

@Component
public class UserMapper {

    public UserResponse entityToResponse(User entity) {
        var ranksByCategoryId = entity.getCategoryRanks().entrySet().stream()
                .collect(toMap(category -> category.getKey().getId(), Map.Entry::getValue));

        return new UserResponse(entity.getId(), entity.getNick(), entity.getEmail(), ranksByCategoryId);
    }

    public UserAuthDetails entityToAuthDetails(User entity) {
        return new UserAuthDetails(entity.getId(), entity.getNick());
    }
}
