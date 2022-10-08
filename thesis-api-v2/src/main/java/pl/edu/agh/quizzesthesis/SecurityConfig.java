package pl.edu.agh.quizzesthesis;

import com.auth0.jwt.algorithms.Algorithm;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import pl.edu.agh.quizzesthesis.business.JwtAuthFilter;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    public static final String ACCESS_TOKEN_COOKIE_NAME = "ACCESS_TOKEN";
    public static final String REFRESH_TOKEN_COOKIE_NAME = "ACCESS_TOKEN";

    private final JwtAuthFilter jwtFilter;

    @Bean
    public AuthenticationManager authenticationManager() {
        return null;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf().disable()
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling()
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .formLogin().disable()
                .httpBasic().disable()
                .authorizeRequests()
                .antMatchers("/api/auth/access-token").permitAll()
                .antMatchers("/api/auth/users").permitAll()
                .antMatchers("/api/**").authenticated()
                .anyRequest().permitAll() // static files at '/'
                .and()
                .build();
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
    public PasswordEncoder passwordEncoder(@Value("${argon2.salt-length}") int saltLength,
                                           @Value("${argon2.hash-length}") int hashLength,
                                           @Value("${argon2.parallelism}") int parallelism,
                                           @Value("${argon2.memory}") int memory,
                                           @Value("${argon2.iterations}") int iterations) {
        return new Argon2PasswordEncoder(saltLength, hashLength, parallelism, memory, iterations);
    }
}
