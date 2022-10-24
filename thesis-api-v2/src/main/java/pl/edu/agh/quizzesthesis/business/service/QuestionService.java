package pl.edu.agh.quizzesthesis.business.service;

import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.QuestionResponse;

public interface QuestionService {

    @Transactional
    QuestionResponse generateQuestion(int categoryId, Integer difficulty);
}
