package pl.edu.agh.quizzesthesis;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import pl.edu.agh.quizzesthesis.business.JwtAuthFilter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    public static final String ACCESS_TOKEN_COOKIE_NAME = "ACCESS_TOKEN";
    public static final String REFRESH_TOKEN_COOKIE_NAME = "REFRESH_TOKEN";

    private final JwtAuthFilter jwtFilter;
    private final AuthenticationEntryPoint authenticationEntryPoint;

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
                .exceptionHandling().authenticationEntryPoint(authenticationEntryPoint)
                .and()
                .formLogin().disable()
                .httpBasic().disable()
                .authorizeRequests()
                // TODO protect endpoints after authentication on frontend finished
                .antMatchers("/api/auth/access-token").permitAll()
                .antMatchers("/api/auth/refresh-token").permitAll()
                .antMatchers("/api/auth/users").permitAll()
                .antMatchers("/api/auth/users/current").authenticated()
                .antMatchers("/api/**").authenticated()
                .anyRequest().permitAll() // static files at '/'
                .and()
                .build();
    }
}
