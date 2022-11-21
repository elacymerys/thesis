package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.QuestionsSetResponse;
import pl.edu.agh.quizzesthesis.api.dto.QuestionsSetsRequest;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;
import pl.edu.agh.quizzesthesis.business.exception.NotFoundException;
import pl.edu.agh.quizzesthesis.business.mapper.QuestionsSetMapper;
import pl.edu.agh.quizzesthesis.data.entity.QuestionsSet;
import pl.edu.agh.quizzesthesis.data.entity.TeacherQuestion;
import pl.edu.agh.quizzesthesis.data.repository.QuestionsSetRepository;
import pl.edu.agh.quizzesthesis.data.repository.TeacherQuestionsRepository;

@Service
@AllArgsConstructor
public class TeacherQuestionsSetService {

    private final QuestionsSetRepository questionsSetRepository;
    private final TeacherQuestionsRepository teacherQuestionsRepository;
    private final QuestionsSetMapper questionsSetMapper;

    @Transactional
    public QuestionsSetResponse getQuestionsSet(String questionsSetKey) {
        var questionsSet = questionsSetRepository.findQuestionsSetNameByQuestionsSetKey(questionsSetKey)
                .orElseThrow(() -> new NotFoundException("Cannot find questions set by key " + questionsSetKey));
        var teacherQuestions = teacherQuestionsRepository.findAllByQuestionsSet(questionsSet);
        return questionsSetMapper.entityToResponse(questionsSet.getQuestionsSetName(), teacherQuestions);
    }

    @Transactional
    public String createQuestionsSet(UserAuthDetails userAuthDetails, QuestionsSetsRequest questionsSetsRequest) {
        var questionsSet = questionsSetRepository.save(
                new QuestionsSet(
                        null,
                        questionsSetsRequest.questionsSetName(),
                        userAuthDetails.id(),
                        userAuthDetails.nick()
                )
        );
        var teacherQuestions = questionsSetsRequest
                .teacherQuestionsRequest()
                .stream()
                .map(teacherQuestionRequest -> new TeacherQuestion(
                        null,
                        teacherQuestionRequest.question(),
                        teacherQuestionRequest.correct(),
                        teacherQuestionRequest.answers(),
                        questionsSet
                )).toList();
        teacherQuestionsRepository.saveAll(teacherQuestions);
        return questionsSet.getQuestionsSetKey();
    }
}
