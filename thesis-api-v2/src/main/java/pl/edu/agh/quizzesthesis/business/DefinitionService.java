package pl.edu.agh.quizzesthesis.business;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.fastily.jwiki.core.Wiki;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
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
        try {
            var pages = getArticleSuggestions(termToFind);
            if (pages.size() == 0) {
                throw new NotFoundException("Cannot find an article for %s".formatted(termToFind));
            }

            var definitionArticle = getFirstDefinitionArticle(pages);
            if (definitionArticle == null) {
                throw new NotFoundException("Cannot find a proper article for %s".formatted(termToFind));
            }
            return definitionArticle;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private List<WikipediaSuggestion> getArticleSuggestions(String termToFind) throws IOException {
        String body = wiki.basicGET(
                "query",
                "list", "search",
                "srsearch", termToFind,
                "utf8", "",
                "format", "json"
        )
                .body()
                .string();

        return objectMapper.readValue(body, WikipediaSearchResult.class)
                .query
                .search;
    }

    private DefinitionArticle getFirstDefinitionArticle(List<WikipediaSuggestion> pages) throws IOException {
        for (var page : pages) {
            var body = wiki.basicGET(
                    "query",
                    "explaintext", "",
                    "prop", "extracts",
                    "pageids", Long.toString(page.pageid),
                    "redirects", "1",
                    "utf8", "",
                    "exintro", "",
                    "format", "json"
            )
                    .body()
                    .string();

            String pageSummary = objectMapper.readValue(body, WikipediaSummaryResult.class)
                    .query
                    .pages.get(Long.toString(page.pageid))
                    .extract;

            if (isUnambiguous(pageSummary)) {
                return new DefinitionArticle(pageSummary, page.title);
            }
        }
        return null;
    }

    private boolean isUnambiguous(String pageSummary) {
        return !pageSummary.contains("may refer to");
    }

    public record DefinitionArticle(String definition, String articleTitle) {}

    private record WikipediaSuggestion(long pageid, String title) {}
    private record WikipediaSearchSuggestions(List<WikipediaSuggestion> search) {}
    private record WikipediaSearchResult(WikipediaSearchSuggestions query) {}

    private record WikipediaPage(String extract) {}
    private record WikipediaPages(Map<String, WikipediaPage> pages) {}
    private record WikipediaSummaryResult(WikipediaPages query) {}
}
