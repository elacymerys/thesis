package pl.edu.agh.quizzesthesis.data;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import pl.edu.agh.quizzesthesis.data.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Integer> {

    @Query("SELECT u FROM User u WHERE u.nick = ?1 OR u.email = ?1")
    Optional<User> findOneByNickOrEmail(String nickOrEmail);

    List<User> findAll();
}
