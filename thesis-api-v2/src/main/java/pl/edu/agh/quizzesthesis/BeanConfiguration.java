package pl.edu.agh.quizzesthesis;

import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.szadowsz.datamuse.DatamuseClient;
import io.github.fastily.jwiki.core.Wiki;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Clock;
import java.util.Random;

@Configuration
public class BeanConfiguration {

    @Bean
    public Wiki wiki() {
        return new Wiki.Builder().build();
    }

    @Bean
    public DatamuseClient datamuseClient() {
        return new DatamuseClient();
    }

    @Bean
    public Random random() {
        return new Random();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Bean
    public Algorithm accessTokenAlgorithm(@Value("${jwt.access-token.secret}") String accessTokenSecret) {
        return Algorithm.HMAC256(accessTokenSecret);
    }

    @Bean
    public Algorithm refreshTokenAlgorithm(@Value("${jwt.refresh-token.secret}") String refreshTokenSecret) {
        return Algorithm.HMAC256(refreshTokenSecret);
    }

    @Bean
    public Clock jwtClock() {
        return Clock.systemUTC();
    }

    @Bean
    public PasswordEncoder passwordEncoder(
            @Value("${argon2.salt-length}") int saltLength,
            @Value("${argon2.hash-length}") int hashLength,
            @Value("${argon2.parallelism}") int parallelism,
            @Value("${argon2.memory}") int memory,
            @Value("${argon2.iterations}") int iterations
    ) {
        return new Argon2PasswordEncoder(saltLength, hashLength, parallelism, memory, iterations);
    }
}
