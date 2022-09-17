package pl.edu.agh.quizzesthesis.business.mapper;

import org.springframework.stereotype.Component;
import pl.edu.agh.quizzesthesis.api.dto.CategoryResponse;
import pl.edu.agh.quizzesthesis.api.dto.TermResponse;
import pl.edu.agh.quizzesthesis.api.dto.TermWithPictureResponse;
import pl.edu.agh.quizzesthesis.data.entity.Category;
import pl.edu.agh.quizzesthesis.data.entity.Term;

@Component
public class TermWithPictureMapper {

    public TermWithPictureResponse entityToResponse(Term entity) {
        return new TermWithPictureResponse(entity.getId(), entity.getName(),
                entity.getPictureURL(), entity.getAuthorName());
    }
}
