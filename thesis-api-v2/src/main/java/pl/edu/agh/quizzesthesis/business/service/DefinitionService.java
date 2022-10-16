package pl.edu.agh.quizzesthesis.business.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.fastily.jwiki.core.Wiki;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.quizzesthesis.business.exception.ExternalServiceException;
import pl.edu.agh.quizzesthesis.business.exception.InternalServiceException;
import pl.edu.agh.quizzesthesis.business.exception.NotFoundException;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class DefinitionService {

    private final Wiki wiki;
    private final ObjectMapper objectMapper;

    public DefinitionArticle getDefinition(String termToFind) {
        var pages = getArticleSuggestions(termToFind);
        if (pages.size() == 0) {
            throw new NotFoundException("Cannot find an article for %s".formatted(termToFind));
        }

        var definitionArticle = getFirstDefinitionArticle(pages);
        if (definitionArticle == null) {
            throw new NotFoundException("Cannot find a proper article for %s".formatted(termToFind));
        }
        return definitionArticle;
    }

    private List<WikipediaSuggestion> getArticleSuggestions(String termToFind) {
        String body = null;
        try {
            var responseBody = wiki.basicGET(
                            "query",
                            "list", "search",
                            "srsearch", termToFind,
                            "utf8", "",
                            "format", "json"
                    )
                    .body();

            if (responseBody != null) {
                body = responseBody.string();
            }
        } catch (IOException e) {
            throw new ExternalServiceException("Error while searching Wikipedia", e);
        }

        if (body == null) {
            throw new ExternalServiceException("Null body while searching Wikipedia");
        }

        try {
            return objectMapper.readValue(body, WikipediaSearchResult.class)
                    .query
                    .search;
        } catch (JsonProcessingException e) {
            throw new InternalServiceException("Error while mapping Wikipedia search result to object", e);
        }
    }

    private DefinitionArticle getFirstDefinitionArticle(List<WikipediaSuggestion> pages) {
        for (var page : pages) {
            String body = null;
            try {
                var responseBody = wiki.basicGET(
                                "query",
                                "explaintext", "",
                                "prop", "extracts",
                                "pageids", Long.toString(page.pageid),
                                "redirects", "1",
                                "utf8", "",
                                "exintro", "",
                                "format", "json"
                        )
                        .body();

                if (responseBody != null) {
                    body = responseBody.string();
                }
            } catch (IOException e) {
                throw new ExternalServiceException("Error while querying Wikipedia article", e);
            }

            if (body == null) {
                throw new ExternalServiceException("Null body while querying Wikipedia article");
            }

            String pageSummary;
            try {
                 pageSummary = objectMapper.readValue(body, WikipediaSummaryResult.class)
                    .query
                    .pages.get(Long.toString(page.pageid))
                    .extract;
            } catch (JsonProcessingException e) {
                throw new InternalServiceException("Error while mapping Wikipedia article query result to object", e);
            }

            if (isUnambiguous(pageSummary)) {
                return new DefinitionArticle(pageSummary, page.title);
            }
        }
        return null;
    }

    private boolean isUnambiguous(String pageSummary) {
        return !pageSummary.contains("may refer to");
    }

    public record DefinitionArticle(String definition, String articleTitle) {
    }

    private record WikipediaSuggestion(long pageid, String title) {
    }

    private record WikipediaSearchSuggestions(List<WikipediaSuggestion> search) {
    }

    private record WikipediaSearchResult(WikipediaSearchSuggestions query) {
    }

    private record WikipediaPage(String extract) {
    }

    private record WikipediaPages(Map<String, WikipediaPage> pages) {
    }

    private record WikipediaSummaryResult(WikipediaPages query) {
    }
}
