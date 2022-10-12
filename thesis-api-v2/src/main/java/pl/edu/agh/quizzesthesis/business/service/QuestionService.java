package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.DefinitionQuestionResponse;
import pl.edu.agh.quizzesthesis.api.dto.PictureQuestionResponse;
import pl.edu.agh.quizzesthesis.business.mapper.PictureMapper;
import pl.edu.agh.quizzesthesis.business.mapper.TermMapper;
import pl.edu.agh.quizzesthesis.data.entity.Term;

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
    private final UnsplashApiService unsplashApiService;
    private final TermMapper termMapper;
    private final PictureMapper pictureMapper;

    @Transactional
    public DefinitionQuestionResponse generateDefinitionQuestion(int categoryId, Integer difficulty) {
        var term = difficulty == null ?
                termService.getRandom(categoryId) : termService.getWithDifficulty(categoryId, difficulty);

        var definitionArticle = definitionService.getDefinition(term.getName());
        String processedDefinition = definitionProcessingService
                .startProcessing(definitionArticle.definition(), term.getName(), definitionArticle.articleTitle())
                .standardizeDefinitionLength()
                .removeAnswerFromDefinition()
                .getDefinition();

        var answers = prepareAnswers(term);

        return new DefinitionQuestionResponse(processedDefinition, termMapper.entityToResponse(term), answers);
    }

    @Transactional
    public PictureQuestionResponse generatePictureQuestion(int categoryId, Integer difficulty) {
        var term = difficulty == null ?
                termService.getRandom(categoryId) : termService.getWithDifficulty(categoryId, difficulty);

        var pictureWithAuthor = unsplashApiService.getPicture(term);

        var answers = prepareAnswers(term);

        return new PictureQuestionResponse(pictureMapper.entityToResponse(term),
                termMapper.entityToResponse(pictureWithAuthor), answers);
    }

    private List<String> prepareAnswers(Term term) {
        var wrongAnswers = wrongAnswerService.getWrongAnswers(term);
        var answers = new ArrayList<String>();
        answers.add(term.getName());
        answers.addAll(wrongAnswers);
        Collections.shuffle(answers);
        return answers;
    }
}
