package pl.edu.agh.quizzesthesis.api.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.quizzesthesis.api.dto.SignInRequest;
import pl.edu.agh.quizzesthesis.api.dto.SignUpRequest;
import pl.edu.agh.quizzesthesis.api.dto.UserResponse;
import pl.edu.agh.quizzesthesis.business.UserAuthDetails;
import pl.edu.agh.quizzesthesis.business.service.AuthService;
import pl.edu.agh.quizzesthesis.business.Current;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.net.URI;
import java.time.Duration;

import static pl.edu.agh.quizzesthesis.SecurityConfig.ACCESS_TOKEN_COOKIE_NAME;
import static pl.edu.agh.quizzesthesis.SecurityConfig.REFRESH_TOKEN_COOKIE_NAME;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final Duration accessTokenDuration;
    private final Duration refreshTokenDuration;

    public AuthController(AuthService authService,
                          @Value("${jwt.access-token.duration}") Duration accessTokenDuration,
                          @Value("${jwt.refresh-token.duration}") Duration refreshTokenDuration) {
        this.authService = authService;
        this.accessTokenDuration = accessTokenDuration;
        this.refreshTokenDuration = refreshTokenDuration;
    }

    @GetMapping("/users/current")
    public UserResponse getCurrentUser(@Current UserAuthDetails userAuthDetails) {
        return authService.getUser(userAuthDetails.id());
    }

    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserResponse> signUp(@Valid @RequestBody SignUpRequest request, HttpServletResponse response) {
        var userAuthTriple = authService.signUp(request);
        setAuthTokensCookies(response, userAuthTriple);

        return ResponseEntity.created(URI.create("/api/auth/users"))
                .body(userAuthTriple.userResponse());
    }

    @PostMapping("/access-token")
    public UserResponse signIn(@Valid @RequestBody SignInRequest request, HttpServletResponse response) {
        var userAuthTriple = authService.signIn(request);
        setAuthTokensCookies(response, userAuthTriple);

        return userAuthTriple.userResponse();
    }

    @PostMapping("/refresh-token")
    public UserResponse refreshTokens(@CookieValue(name = REFRESH_TOKEN_COOKIE_NAME, defaultValue = "") String refreshToken,
                                      HttpServletResponse response) {
        var userAuthTriple = authService.refreshTokens(refreshToken);
        setAuthTokensCookies(response, userAuthTriple);

        return userAuthTriple.userResponse();
    }

    private void setAuthTokensCookies(HttpServletResponse response, AuthService.UserAuthTriple userAuthTriple) {
        response.addCookie(generateAccessTokenCookie(userAuthTriple.accessToken()));
        response.addCookie(generateRefreshTokenCookie(userAuthTriple.refreshToken()));
    }

    private Cookie generateAccessTokenCookie(String accessToken) {
        var accessTokenCookie = new Cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken);
        accessTokenCookie.setMaxAge((int) accessTokenDuration.toSeconds());
        accessTokenCookie.setHttpOnly(true);
        // TODO: uncomment after HTTPS added
        // accessTokenCookie.setSecure(true);

        return accessTokenCookie;
    }

    private Cookie generateRefreshTokenCookie(String refreshToken) {
        var refreshTokenCookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken);
        refreshTokenCookie.setMaxAge((int) refreshTokenDuration.toSeconds());
        refreshTokenCookie.setPath("/api/auth/refresh-token");
        refreshTokenCookie.setHttpOnly(true);
        // TODO: uncomment after HTTPS added
        // accessTokenCookie.setSecure(true);

        return refreshTokenCookie;
    }
}
