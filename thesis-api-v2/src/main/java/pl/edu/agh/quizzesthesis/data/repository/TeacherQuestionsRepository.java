package pl.edu.agh.quizzesthesis.data.repository;

import org.springframework.data.repository.CrudRepository;
import pl.edu.agh.quizzesthesis.data.entity.QuestionsSet;
import pl.edu.agh.quizzesthesis.data.entity.TeacherQuestion;

import java.util.List;

public interface TeacherQuestionsRepository extends CrudRepository<TeacherQuestion, Integer> {

    List<TeacherQuestion> findAllByQuestionsSet(QuestionsSet questionsSet);
}
