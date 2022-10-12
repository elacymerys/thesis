package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.ResponseSpec;
import pl.edu.agh.quizzesthesis.api.dto.PictureWithAuthorResponse;
import pl.edu.agh.quizzesthesis.api.dto.TermPictureUpdateRequest;
import pl.edu.agh.quizzesthesis.business.exception.UnsplashException;
import pl.edu.agh.quizzesthesis.data.entity.Term;

import static pl.edu.agh.quizzesthesis.Credentials.UNSPLASH_API_KEY;

@Service
@AllArgsConstructor
public class UnsplashApiService {
    private final TermService termService;
    private final WebClient unsplashApiClient;
    
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
        ResponseSpec responseSpec = getResponseSpec(term.getName());
        String responseBody = responseSpec.bodyToMono(String.class).block();

        PictureWithAuthorResponse fromResponse = getFromResponse(responseBody);
        term.setPictureURL(fromResponse.pictureURL());
        term.setAuthorName(fromResponse.authorName());
    }

    @NotNull
    private ResponseSpec getResponseSpec(String termName) {
        return unsplashApiClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/photos")
                        .queryParam("per_page", "1")
                        .queryParam("query", termName)
                        .build())
                .header("Authorization", "Client-ID " + UNSPLASH_API_KEY)
                .retrieve();
    }

    private PictureWithAuthorResponse getFromResponse(String responseBody){
        String pictureURL;
        String authorName;
        try {
            JSONObject jsonResponse = new JSONObject(responseBody);
            pictureURL = jsonResponse.getJSONArray("results")
                    .getJSONObject(0).getJSONObject("urls").getString("regular");
            authorName = jsonResponse.getJSONArray("results")
                    .getJSONObject(0).getJSONObject("user").getString("name");
        } catch (JSONException e) {
            throw new UnsplashException("Error getting data from Unsplash");
        }
        return new PictureWithAuthorResponse(pictureURL, authorName);
    }

}
