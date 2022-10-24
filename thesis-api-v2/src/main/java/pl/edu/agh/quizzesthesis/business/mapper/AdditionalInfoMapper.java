package pl.edu.agh.quizzesthesis.business.mapper;

import org.springframework.stereotype.Component;
import pl.edu.agh.quizzesthesis.api.dto.AuthorNameResponse;
import pl.edu.agh.quizzesthesis.data.entity.Term;

@Component
public class AdditionalInfoMapper {

    public AuthorNameResponse entityToResponse(Term entity)  {
        if (entity == null) return new AuthorNameResponse(null);
        return new AuthorNameResponse(entity.getAuthorName());
    }
}
