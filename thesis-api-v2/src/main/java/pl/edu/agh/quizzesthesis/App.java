package pl.edu.agh.quizzesthesis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {

	public static final String API_URL_PREFIX = "/api";

	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}
}
