package pl.edu.agh.quizzesthesis.data.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.data.entity.Category;
import pl.edu.agh.quizzesthesis.data.entity.SearchPhrase;

import pl.edu.agh.quizzesthesis.data.entity.Term;

import java.util.List;
import java.util.Set;

public interface TermRepository extends PagingAndSortingRepository<Term, Integer> {

    boolean existsByNameAndCategoryId(String termName, int categoryId);

    Set<Term> findAllByCategoryId(int categoryId);

    int countBySearchPhraseId(int searchPhraseId);

    @Transactional
    void deleteAllBySearchPhrase(SearchPhrase searchPhrase);

    @Transactional
    void deleteAllByCategory(Category category);

    @Query(nativeQuery = true, value = "SELECT * FROM term WHERE category_id = ?1 " +
            "AND (total_answers_counter < 100 OR (flag_counter / total_answers_counter) < 0.9) " +
            "ORDER BY ABS(difficulty - ?2) ASC LIMIT 50")
    List<Term> findByCategoryAndDifficulty(int categoryId, float difficulty);
}
