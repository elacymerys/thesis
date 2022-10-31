package pl.edu.agh.quizzesthesis.data.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.data.entity.SearchPhrase;
import pl.edu.agh.quizzesthesis.data.entity.Term;

import java.util.Set;

public interface TermRepository extends PagingAndSortingRepository<Term, Integer> {

    boolean existsByNameAndCategoryId(String termName, int categoryId);
    Set<Term> findAllByCategoryId(int searchPhraseId);


    int countByCategoryId(int categoryId);
    int countBySearchPhraseId(int categoryId);

    Page<Term> findPageByCategoryId(PageRequest pageRequest, int categoryId);

    @Transactional
    void deleteAllBySearchPhrase(SearchPhrase searchPhrase);

}
