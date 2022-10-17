package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.QuestionResponse;
import pl.edu.agh.quizzesthesis.business.mapper.AdditionalInfoMapper;
import pl.edu.agh.quizzesthesis.business.mapper.TermMapper;

@Service
@AllArgsConstructor
public class PictureQuestionService implements QuestionService<QuestionResponse> {
    private final TermService termService;
    private final UnsplashApiService unsplashApiService;
    private final WrongAnswerService wrongAnswerService;
    private final AdditionalInfoMapper additionalInfoMapper;
    private final TermMapper termMapper;

    @Override
    @Transactional
    public QuestionResponse generateQuestion(int categoryId, Integer difficulty) {
        var term = difficulty == null ?
                termService.getRandom(categoryId) : termService.getWithDifficulty(categoryId, difficulty);

        var pictureWithAuthor = unsplashApiService.getPicture(term);

        var answers = wrongAnswerService.prepareAnswers(term);

        return new QuestionResponse(1, term.getPictureURL(),
                termMapper.entityToResponse(pictureWithAuthor), answers, additionalInfoMapper.entityToResponse(term));
    }
}
