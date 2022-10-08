package pl.edu.agh.quizzesthesis.data.repository;

import org.springframework.data.repository.CrudRepository;
import pl.edu.agh.quizzesthesis.data.entity.Category;

import java.util.Collection;
import java.util.List;

public interface CategoryRepository extends CrudRepository<Category, Integer> {

    List<Category> saveAll(Collection<Category> categories);

    List<Category> findAll();
}
