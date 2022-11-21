package pl.edu.agh.quizzesthesis.data.repository;

import org.springframework.data.repository.CrudRepository;
import pl.edu.agh.quizzesthesis.data.entity.QuestionsSet;

import java.util.Optional;

public interface QuestionsSetRepository extends CrudRepository<QuestionsSet, String> {

    Optional<QuestionsSet> findQuestionsSetNameByQuestionsSetKey(String questionsSetKey);
}
