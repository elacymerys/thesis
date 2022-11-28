package pl.edu.agh.quizzesthesis.business.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.DefinitionQuestionResponse;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;
import pl.edu.agh.quizzesthesis.business.mapper.TermMapper;

@Service
public class DefinitionQuestionService extends QuestionService<DefinitionQuestionResponse> {

    private static final int DEFINITION_QUESTION_TYPE_ID = 0;

    private final TermService termService;
    private final DefinitionService definitionService;
    private final DefinitionProcessingService definitionProcessingService;
    private final WrongAnswerService wrongAnswerService;
    private final TermMapper termMapper;

    public DefinitionQuestionService(UserService userService, TermService termService, DefinitionService definitionService,
                                     DefinitionProcessingService definitionProcessingService,
                                     WrongAnswerService wrongAnswerService, TermMapper termMapper) {
        super(userService);
        this.termService = termService;
        this.definitionService = definitionService;
        this.definitionProcessingService = definitionProcessingService;
        this.wrongAnswerService = wrongAnswerService;
        this.termMapper = termMapper;
    }

    @Override
    @Transactional
    public DefinitionQuestionResponse generateQuestion(int categoryId, UserAuthDetails userAuthDetails) {
        var term = termService.getWithDifficulty(categoryId, getUserRankInCategory(userAuthDetails, categoryId));

        var definitionArticle = definitionService.getDefinition(term.getName());
        String processedDefinition = definitionProcessingService
                .startProcessing(definitionArticle.definition(), term.getName(), definitionArticle.articleTitle())
                .standardizeDefinitionLength()
                .removeTextInBracketsFromDefinition()
                .removeAnswerFromDefinition()
                .getDefinition();

        var answers = wrongAnswerService.prepareAnswers(term);

        return new DefinitionQuestionResponse(DEFINITION_QUESTION_TYPE_ID, processedDefinition,
                termMapper.entityToResponse(term), answers);
    }
}
