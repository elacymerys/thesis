package pl.edu.agh.quizzesthesis.business.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.PictureQuestionResponse;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;
import pl.edu.agh.quizzesthesis.business.mapper.TermMapper;

@Service
public class PictureQuestionService extends QuestionService<PictureQuestionResponse> {
    private static final int PICTURE_QUESTION_TYPE_ID = 1;

    private final TermService termService;
    private final UnsplashApiService unsplashApiService;
    private final WrongAnswerService wrongAnswerService;
    private final TermMapper termMapper;

    public PictureQuestionService(UserService userService, TermService termService, UnsplashApiService unsplashApiService, WrongAnswerService wrongAnswerService, TermMapper termMapper) {
        super(userService);
        this.termService = termService;
        this.unsplashApiService = unsplashApiService;
        this.wrongAnswerService = wrongAnswerService;
        this.termMapper = termMapper;
    }

    @Override
    @Transactional
    public PictureQuestionResponse generateQuestion(int categoryId, UserAuthDetails userAuthDetails) {
        var term = termService.getWithDifficulty(categoryId, getUserRankInCategory(userAuthDetails, categoryId));

        var pictureWithAuthor = unsplashApiService.getPicture(term);

        var answers = wrongAnswerService.prepareAnswers(term);

        return new PictureQuestionResponse(PICTURE_QUESTION_TYPE_ID, term.getPictureURL(),
                termMapper.entityToResponse(pictureWithAuthor), answers, term.getAuthorName(), term.getAuthorProfileURL());
    }
}
