package pl.edu.agh.quizzesthesis.business.mapper;

import org.springframework.stereotype.Component;
import pl.edu.agh.quizzesthesis.api.dto.CategoryResponse;
import pl.edu.agh.quizzesthesis.api.dto.TermResponse;
import pl.edu.agh.quizzesthesis.data.entity.Category;
import pl.edu.agh.quizzesthesis.data.entity.Term;

@Component
public class TermMapper {

    public TermResponse entityToResponse(Term entity) {
        return new TermResponse(entity.getId(), entity.getName());
    }
}
