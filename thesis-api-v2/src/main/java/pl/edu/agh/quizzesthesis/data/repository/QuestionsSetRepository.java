package pl.edu.agh.quizzesthesis.data.repository;

import org.springframework.data.repository.CrudRepository;
import pl.edu.agh.quizzesthesis.data.entity.QuestionsSet;
import pl.edu.agh.quizzesthesis.data.entity.User;

import java.util.List;
import java.util.Optional;

public interface QuestionsSetRepository extends CrudRepository<QuestionsSet, String> {

    Optional<QuestionsSet> findByQuestionsSetKeyAndUser(String questionSetKey, User user);

    List<QuestionsSet> findAllByUser(User user);
}
