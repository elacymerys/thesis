package pl.edu.agh.quizzesthesis.business.service;

import org.springframework.transaction.annotation.Transactional;

public interface QuestionService<T> {

    @Transactional
    T generateQuestion(int categoryId, Integer difficulty);
}
