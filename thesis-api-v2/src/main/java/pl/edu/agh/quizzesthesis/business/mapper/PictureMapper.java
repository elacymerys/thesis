package pl.edu.agh.quizzesthesis.business.mapper;

import org.springframework.stereotype.Component;
import pl.edu.agh.quizzesthesis.api.dto.PictureWithAuthorResponse;
import pl.edu.agh.quizzesthesis.data.entity.Term;

@Component
public class PictureMapper {

    public PictureWithAuthorResponse entityToResponse(Term entity)  {
        return new PictureWithAuthorResponse(entity.getPictureURL(), entity.getAuthorName());
    }
}
