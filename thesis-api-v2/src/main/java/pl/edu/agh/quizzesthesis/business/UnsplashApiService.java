package pl.edu.agh.quizzesthesis.business;

import lombok.AllArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import pl.edu.agh.quizzesthesis.api.dto.TermPictureUpdateRequest;
import pl.edu.agh.quizzesthesis.data.entity.Term;

@Service
@AllArgsConstructor
public class UnsplashApiService {
    private final TermService termService;

    public Term getPicture(Term term){
        if (term.getPictureURL() != null){
            return term;
        }
        getFromUnsplash(term);
        termService.updateTermPicture(term.getId(),
                new TermPictureUpdateRequest(term.getPictureURL(), term.getAuthorName()));
        return term;
    }

    private void getFromUnsplash(Term term){
        WebClient client = WebClient.create("https://api.unsplash.com");

        WebClient.ResponseSpec responseSpec = client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search/photos")
                        .queryParam("per_page", "1")
                        .queryParam("query", term.getName())
                        .build())
                .header("Authorization", "Client-ID Zz5YXPnj5aCUi601vscOvi7e3KGkuwSXdpWwrmQQIwU")
                .retrieve();
        String responseBody = responseSpec.bodyToMono(String.class).block();
        JSONObject jsonResponse = new JSONObject(responseBody);
        String pictureURL = jsonResponse.getJSONArray("results")
                .getJSONObject(0).getJSONObject("urls").getString("raw");
        String authorName = jsonResponse.getJSONArray("results")
                .getJSONObject(0).getJSONObject("user").getString("name");
        term.setPictureURL(pictureURL);
        term.setAuthorName(authorName);
    }

}
