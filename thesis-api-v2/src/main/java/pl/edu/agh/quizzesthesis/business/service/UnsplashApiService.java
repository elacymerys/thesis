package pl.edu.agh.quizzesthesis.business.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.ResponseSpec;
import pl.edu.agh.quizzesthesis.api.dto.PictureWithAuthorResponse;
import pl.edu.agh.quizzesthesis.api.dto.TermPictureUpdateRequest;
import pl.edu.agh.quizzesthesis.business.exception.UnsplashException;
import pl.edu.agh.quizzesthesis.data.entity.Term;

@Service
@AllArgsConstructor
public class UnsplashApiService {

    private final TermService termService;
    private final WebClient unsplashApiClient;
    private final ObjectMapper objectMapper;
    private final Environment env;

    @Transactional
    public Term getPicture(Term term) {
        if (term.getPictureURL() != null) {
            return term;
        }
        getFromUnsplash(term);
        termService.updateTermPicture(term.getId(),
                new TermPictureUpdateRequest(term.getPictureURL(), term.getAuthorName()));
        return term;
    }

    private void getFromUnsplash(Term term) {
        var responseSpec = getResponseSpec(term.getName());
        var responseBody = responseSpec.bodyToMono(String.class).block();

        var fromResponse = getFromResponse(responseBody);
        term.setPictureURL(fromResponse.pictureURL());
        term.setAuthorName(fromResponse.authorName());
        term.setAuthorProfileURL(fromResponse.authorProfileURL());
    }

    @NotNull
    private ResponseSpec getResponseSpec(String termName) {
        if (env.getProperty("UNSPLASH_API_KEY") == null || env.getProperty("UNSPLASH_API_KEY").isEmpty()) {
            throw new UnsplashException("UNSPLASH_API_KEY not set");
        }
        return unsplashApiClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/photos")
                        .queryParam("per_page", "1")
                        .queryParam("query", termName)
                        .build())
                .header("Authorization", "Client-ID " + env.getProperty("UNSPLASH_API_KEY"))
                .retrieve();
    }

    private PictureWithAuthorResponse getFromResponse(String responseBody) {
        String pictureURL;
        String authorName;
        String authorProfileURL;
        try {
            pictureURL = objectMapper
                    .readTree(responseBody)
                    .get("results")
                    .get(0)
                    .get("urls")
                    .get("regular")
                    .asText();
            authorName = objectMapper
                    .readTree(responseBody)
                    .get("results")
                    .get(0)
                    .get("user")
                    .get("name")
                    .asText();
            authorProfileURL = objectMapper
                    .readTree(responseBody)
                    .get("results")
                    .get(0)
                    .get("user")
                    .get("links")
                    .get("html")
                    .asText();
        } catch (JsonProcessingException e) {
            throw new UnsplashException("Error getting data from Unsplash");
        }
        return new PictureWithAuthorResponse(pictureURL, authorName, authorProfileURL);
    }
}
