package pl.edu.agh.quizzesthesis;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.szadowsz.datamuse.DatamuseClient;
import io.github.fastily.jwiki.core.Wiki;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
    public Clock clock() {
        return Clock.systemUTC();
    }
}
