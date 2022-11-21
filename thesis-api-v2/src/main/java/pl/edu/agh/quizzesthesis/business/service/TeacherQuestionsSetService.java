package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.QuestionsSetResponse;
import pl.edu.agh.quizzesthesis.business.exception.NotFoundException;
import pl.edu.agh.quizzesthesis.business.mapper.QuestionsSetMapper;
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
}
