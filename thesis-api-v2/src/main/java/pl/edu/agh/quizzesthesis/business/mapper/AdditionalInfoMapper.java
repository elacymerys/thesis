package pl.edu.agh.quizzesthesis.business.mapper;

import org.springframework.stereotype.Component;
import pl.edu.agh.quizzesthesis.api.dto.AdditionalInfoResponse;
import pl.edu.agh.quizzesthesis.data.entity.Term;

@Component
public class AdditionalInfoMapper {

    public AdditionalInfoResponse entityToResponse(Term entity)  {
        if (entity == null) return new AdditionalInfoResponse(null);
        return new AdditionalInfoResponse(entity.getAuthorName());
    }
}
