package pl.edu.agh.quizzesthesis.data.repository;

import org.springframework.data.repository.CrudRepository;
import pl.edu.agh.quizzesthesis.data.entity.QuestionsSet;

import java.util.List;
import java.util.Optional;

public interface QuestionsSetRepository extends CrudRepository<QuestionsSet, String> {

    Optional<QuestionsSet> findByQuestionsSetKey(String questionsSetKey);

    Optional<QuestionsSet> findByQuestionsSetKeyAndTeacherId(String questionSetKey, int teacherId);

    void deleteByQuestionsSetKey(String questionSetKey);

    List<QuestionsSet> findAllByTeacherId(int teacherId);
}
