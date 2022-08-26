package pl.edu.agh.quizzesthesis;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.fastily.jwiki.core.Wiki;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import pl.edu.agh.quizzesthesis.business.DefinitionService;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

@SpringBootApplication
public class App {

	public static final String API_URL_PREFIX = "/api";

	private static final ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

	public static void main(String[] args) throws IOException {
		var wiki = new Wiki.Builder().build();
		while (true) {
			var scanner = new Scanner(System.in);
			var s = new DefinitionService(wiki, mapper);
			System.out.println(s.getDefinition("exception"));
			String line = scanner.next();
		}

		//SpringApplication.run(App.class, args);
	}

	private record WikipediaSuggestion(long pageid) {}
	private record WikipediaSearchSuggestions(List<WikipediaSuggestion> search) {}
	private record WikipediaSearchResult(WikipediaSearchSuggestions query) {}

	private record WikipediaPage(String extract) {}
	private record WikipediaPages(Map<String, WikipediaPage> pages) {}
	private record WikipediaSummaryResult(WikipediaPages query) {}
}
