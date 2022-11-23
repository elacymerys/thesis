package pl.edu.agh.quizzesthesis.business.mapper;

import org.springframework.stereotype.Component;
import pl.edu.agh.quizzesthesis.api.dto.QuestionsSetResponse;
import pl.edu.agh.quizzesthesis.api.dto.TeacherQuestionResponse;
import pl.edu.agh.quizzesthesis.data.entity.TeacherQuestion;

import java.util.List;

@Component
public class QuestionsSetMapper {

    public QuestionsSetResponse entityToResponse(String questionsSetName, List<TeacherQuestion> teacherQuestions) {
        var teacherQuestionsResponse = teacherQuestions
                .stream()
                .map(teacherQuestion -> new TeacherQuestionResponse(
                        teacherQuestion.getQuestion(),
                        teacherQuestion.getCorrect(),
                        teacherQuestion.getAnswers()
                ))
                .toList();
        return new QuestionsSetResponse(questionsSetName, teacherQuestionsResponse);
    }
}
