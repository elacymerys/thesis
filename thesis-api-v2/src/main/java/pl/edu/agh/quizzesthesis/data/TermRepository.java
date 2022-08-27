package pl.edu.agh.quizzesthesis.data;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import pl.edu.agh.quizzesthesis.data.entity.Term;

@Repository
public interface TermRepository extends PagingAndSortingRepository<Term, Integer> {

    boolean existsByNameAndCategoryId(String termName, int categoryId);
}
