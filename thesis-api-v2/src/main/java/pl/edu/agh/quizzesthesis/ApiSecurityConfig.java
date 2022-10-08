package pl.edu.agh.quizzesthesis;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import pl.edu.agh.quizzesthesis.business.JwtAuthFilter;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class ApiSecurityConfig {

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
}
