package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.SearchPhraseResponse;
import pl.edu.agh.quizzesthesis.business.mapper.SearchPhraseMapper;
import pl.edu.agh.quizzesthesis.data.entity.SearchPhrase;
import pl.edu.agh.quizzesthesis.data.repository.SearchPhraseRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class SearchPhraseService {

    private final SearchPhraseRepository searchPhraseRepository;
    public List<SearchPhrase> getAll() {
        return searchPhraseRepository.findAll();
    }
}
