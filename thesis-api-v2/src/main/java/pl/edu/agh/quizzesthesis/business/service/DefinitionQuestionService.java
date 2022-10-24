package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.QuestionResponse;
import pl.edu.agh.quizzesthesis.business.mapper.AdditionalInfoMapper;
import pl.edu.agh.quizzesthesis.business.mapper.TermMapper;

@Service
@AllArgsConstructor
public class DefinitionQuestionService implements QuestionService {

    private final TermService termService;
    private final DefinitionService definitionService;
    private final DefinitionProcessingService definitionProcessingService;
    private final WrongAnswerService wrongAnswerService;
    private final TermMapper termMapper;
    private final AdditionalInfoMapper additionalInfoMapper;
    private static final int definitionQuestionTypeId = 0;

    @Override
    @Transactional
    public QuestionResponse generateQuestion(int categoryId, Integer difficulty) {
        var term = difficulty == null ?
                termService.getRandom(categoryId) : termService.getWithDifficulty(categoryId, difficulty);

        var definitionArticle = definitionService.getDefinition(term.getName());
        String processedDefinition = definitionProcessingService
                .startProcessing(definitionArticle.definition(), term.getName(), definitionArticle.articleTitle())
                .standardizeDefinitionLength()
                .removeAnswerFromDefinition()
                .getDefinition();

        var answers = wrongAnswerService.prepareAnswers(term);

        return new QuestionResponse(definitionQuestionTypeId, processedDefinition, termMapper.entityToResponse(term),
                answers, additionalInfoMapper.entityToResponse(null));
    }
}
