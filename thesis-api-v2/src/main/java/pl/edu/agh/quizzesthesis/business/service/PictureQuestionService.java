package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.QuestionResponse;
import pl.edu.agh.quizzesthesis.business.mapper.AdditionalInfoMapper;
import pl.edu.agh.quizzesthesis.business.mapper.TermMapper;

@Service
@AllArgsConstructor
public class PictureQuestionService implements QuestionService {
    private final TermService termService;
    private final UnsplashApiService unsplashApiService;
    private final WrongAnswerService wrongAnswerService;
    private final AdditionalInfoMapper additionalInfoMapper;
    private final TermMapper termMapper;
    private static final int pictureQuestionTypeId = 1;

    @Override
    @Transactional
    public QuestionResponse generateQuestion(int categoryId, Integer difficulty) {
        var term = difficulty == null ?
                termService.getRandom(categoryId) : termService.getWithDifficulty(categoryId, difficulty);

        var pictureWithAuthor = unsplashApiService.getPicture(term);

        var answers = wrongAnswerService.prepareAnswers(term);

        return new QuestionResponse(pictureQuestionTypeId, term.getPictureURL(),
                termMapper.entityToResponse(pictureWithAuthor), answers, additionalInfoMapper.entityToResponse(term));
    }
}
