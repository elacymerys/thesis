package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.QuestionsSetKeyResponse;
import pl.edu.agh.quizzesthesis.api.dto.QuestionsSetNameKeySizeResponse;
import pl.edu.agh.quizzesthesis.api.dto.QuestionsSetResponse;
import pl.edu.agh.quizzesthesis.api.dto.QuestionsSetsRequest;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;
import pl.edu.agh.quizzesthesis.business.exception.NotFoundException;
import pl.edu.agh.quizzesthesis.business.exception.UnknownUserException;
import pl.edu.agh.quizzesthesis.business.mapper.QuestionsSetMapper;
import pl.edu.agh.quizzesthesis.data.entity.QuestionsSet;
import pl.edu.agh.quizzesthesis.data.entity.TeacherQuestion;
import pl.edu.agh.quizzesthesis.data.repository.QuestionsSetRepository;
import pl.edu.agh.quizzesthesis.data.repository.TeacherQuestionsRepository;
import pl.edu.agh.quizzesthesis.data.repository.UserRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class TeacherQuestionsSetService {

    private final QuestionsSetRepository questionsSetRepository;
    private final TeacherQuestionsRepository teacherQuestionsRepository;
    private final UserRepository userRepository;
    private final QuestionsSetMapper questionsSetMapper;

    @Transactional
    public QuestionsSetResponse getQuestionsSet(String questionsSetKey) {
        var questionsSet = questionsSetRepository.findById(questionsSetKey)
                .orElseThrow(() -> new NotFoundException("Cannot find questions set by key " + questionsSetKey));
        var teacherQuestions = teacherQuestionsRepository.findAllByQuestionsSet(questionsSet);
        return questionsSetMapper.entityToResponse(questionsSet.getQuestionsSetName(), teacherQuestions);
    }

    @Transactional
    public QuestionsSetKeyResponse createQuestionsSet(UserAuthDetails userAuthDetails, QuestionsSetsRequest questionsSetsRequest) {
        var user = userRepository.findById(userAuthDetails.id())
                .orElseThrow(() -> new UnknownUserException("Cannot create questions set for user with id " + userAuthDetails.id()));
        var questionsSet = questionsSetRepository.save(
                new QuestionsSet(
                        null,
                        questionsSetsRequest.questionsSetName(),
                        user,
                        questionsSetsRequest.teacherQuestionsRequest().size()
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
        return new QuestionsSetKeyResponse(questionsSet.getQuestionsSetKey());
    }

    @Transactional
    public void deleteQuestionsSet(UserAuthDetails userAuthDetails, String questionsSetKey) {
        var user = userRepository.findById(userAuthDetails.id())
                .orElseThrow(() -> new UnknownUserException("Cannot delete questions set for user with id " + userAuthDetails.id()));
        var questionsSet = questionsSetRepository
                .findByQuestionsSetKeyAndUser(questionsSetKey, user)
                .orElseThrow(() -> new NotFoundException("Cannot delete questions set by key " + questionsSetKey));

        teacherQuestionsRepository.deleteAllByQuestionsSet(questionsSet);
        questionsSetRepository.deleteById(questionsSetKey);
    }

    @Transactional
    public List<QuestionsSetNameKeySizeResponse> getQuestionsSetsNamesKeysAndSizes(UserAuthDetails userAuthDetails) {
        var user = userRepository.findById(userAuthDetails.id())
                .orElseThrow(() -> new UnknownUserException("Cannot list questions sets for user with id " + userAuthDetails.id()));
        var questionsSets = questionsSetRepository.findAllByUser(user);
        return questionsSets
                .stream()
                .map(questionsSet -> new QuestionsSetNameKeySizeResponse(
                        questionsSet.getQuestionsSetName(),
                        questionsSet.getQuestionsSetKey(),
                        questionsSet.getNumberOfQuestions()
                )).toList();
    }

    @Transactional
    public QuestionsSetKeyResponse refreshQuestionsSetKey(UserAuthDetails userAuthDetails, String questionsSetKey) {
        var user = userRepository.findById(userAuthDetails.id())
                .orElseThrow(() -> new UnknownUserException("Cannot refresh questions set key for user with id " + userAuthDetails.id()));
        var questionsSet = questionsSetRepository.
                findByQuestionsSetKeyAndUser(questionsSetKey, user)
                .orElseThrow(() -> new NotFoundException("Cannot refresh questions set key for key " + questionsSetKey));
        var teacherQuestions = teacherQuestionsRepository.findAllByQuestionsSet(questionsSet);
        var newQuestionSet = questionsSetRepository.save(
                new QuestionsSet(
                        null,
                        questionsSet.getQuestionsSetName(),
                        user,
                        questionsSet.getNumberOfQuestions()
                )
        );
        var updatedTeacherQuestions = teacherQuestions
                .stream()
                .peek(teacherQuestion -> teacherQuestion.setQuestionsSet(newQuestionSet))
                .toList();

        teacherQuestionsRepository.saveAll(updatedTeacherQuestions);
        questionsSetRepository.delete(questionsSet);
        return new QuestionsSetKeyResponse(newQuestionSet.getQuestionsSetKey());
    }
}
