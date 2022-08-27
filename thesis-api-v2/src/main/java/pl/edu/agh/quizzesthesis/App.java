package pl.edu.agh.quizzesthesis;

import com.szadowsz.datamuse.DatamuseException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

@SpringBootApplication
public class App {

	public static final String API_URL_PREFIX = "/api";

	public static void main(String[] args) throws IOException, DatamuseException {
		SpringApplication.run(App.class, args);
	}
}
