package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.PictureQuestionResponse;
import pl.edu.agh.quizzesthesis.business.mapper.PictureMapper;
import pl.edu.agh.quizzesthesis.business.mapper.TermMapper;

@Service
@AllArgsConstructor
public class PictureQuestionService implements QuestionService<PictureQuestionResponse> {
    private final TermService termService;
    private final UnsplashApiService unsplashApiService;
    private final WrongAnswerService wrongAnswerService;
    private final PictureMapper pictureMapper;
    private final TermMapper termMapper;

    @Override
    @Transactional
    public PictureQuestionResponse generateQuestion(int categoryId, Integer difficulty) {
        var term = difficulty == null ?
                termService.getRandom(categoryId) : termService.getWithDifficulty(categoryId, difficulty);

        var pictureWithAuthor = unsplashApiService.getPicture(term);

        var answers = wrongAnswerService.prepareAnswers(term);

        return new PictureQuestionResponse(pictureMapper.entityToResponse(term),
                termMapper.entityToResponse(pictureWithAuthor), answers);
    }
}
