package pl.edu.agh.quizzesthesis.business.mapper;

import org.springframework.stereotype.Component;
import pl.edu.agh.quizzesthesis.api.dto.AuthorResponse;
import pl.edu.agh.quizzesthesis.data.entity.Term;

@Component
public class AdditionalInfoMapper {

    public AuthorResponse entityToResponse(Term entity)  {
        if (entity == null) return new AuthorResponse(null);
        return new AuthorResponse(entity.getAuthorName());
    }
}
