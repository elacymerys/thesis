package pl.edu.agh.quizzesthesis.data.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.data.entity.Category;
import pl.edu.agh.quizzesthesis.data.entity.SearchPhrase;

import java.util.List;

public interface SearchPhraseRepository extends CrudRepository<SearchPhrase, Integer> {

    List<SearchPhrase> findAll();

    @Transactional
    void deleteAllByCategory(Category category);
}
