package pl.edu.agh.quizzesthesis.business;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.CategoryResponse;
import pl.edu.agh.quizzesthesis.api.dto.QuestionResponse;
import pl.edu.agh.quizzesthesis.business.mapper.CategoryMapper;
import pl.edu.agh.quizzesthesis.business.mapper.TermMapper;
import pl.edu.agh.quizzesthesis.data.CategoryRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
public class QuestionService {

    private final TermService termService;
    private final DefinitionService definitionService;
    private final DefinitionProcessingService definitionProcessingService;
    private final WrongAnswerService wrongAnswerService;
    private final TermMapper termMapper;

    @Transactional
    public QuestionResponse generateQuestion(int categoryId) {
        var term = termService.getRandom(categoryId);
        var definitionArticle = definitionService.getDefinition(term.getName());
        String processedDefinition = definitionProcessingService
                .startProcessing(definitionArticle.definition(), term.getName(), definitionArticle.articleTitle())
                .standardizeDefinitionLength()
                .removeAnswerFromDefinition()
                .getDefinition();

        var wrongAnswers = wrongAnswerService.getWrongAnswers(term);
        var answers = new ArrayList<String>();
        answers.add(term.getName());
        answers.addAll(wrongAnswers);
        Collections.shuffle(answers);

        return new QuestionResponse(processedDefinition, termMapper.entityToResponse(term), answers);
    }
}
