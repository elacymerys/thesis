package pl.edu.agh.quizzesthesis.business.mapper;

import org.springframework.stereotype.Component;
import pl.edu.agh.quizzesthesis.api.dto.SearchPhraseResponse;
import pl.edu.agh.quizzesthesis.data.entity.SearchPhrase;

@Component
public class SearchPhraseMapper {

    public SearchPhraseResponse entityToResponse(SearchPhrase entity) {
        return new SearchPhraseResponse(entity.getId(), entity.getSearchWord());
    }
}
