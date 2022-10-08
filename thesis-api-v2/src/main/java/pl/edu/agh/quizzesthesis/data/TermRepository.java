package pl.edu.agh.quizzesthesis.data;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.repository.PagingAndSortingRepository;
import pl.edu.agh.quizzesthesis.data.entity.Term;

import java.util.Set;

public interface TermRepository extends PagingAndSortingRepository<Term, Integer> {

    boolean existsByNameAndCategoryId(String termName, int categoryId);

    Set<Term> findAllByCategoryId(int categoryId);

    int countByCategoryId(int categoryId);

    Page<Term> findPageByCategoryId(PageRequest pageRequest, int categoryId);
}
