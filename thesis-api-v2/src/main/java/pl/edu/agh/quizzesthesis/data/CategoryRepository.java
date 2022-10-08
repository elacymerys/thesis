package pl.edu.agh.quizzesthesis.data;

import org.springframework.data.repository.CrudRepository;
import pl.edu.agh.quizzesthesis.data.entity.Category;

import java.util.List;

public interface CategoryRepository extends CrudRepository<Category, Integer> {

    List<Category> findAll();
}
