package pl.edu.agh.quizzesthesis.api;

import org.apache.commons.lang3.tuple.Triple;
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
import pl.edu.agh.quizzesthesis.business.AuthService;
import pl.edu.agh.quizzesthesis.business.Current;
import pl.edu.agh.quizzesthesis.business.mapper.UserMapper;
import pl.edu.agh.quizzesthesis.data.entity.User;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.net.URI;
import java.time.Duration;

import static pl.edu.agh.quizzesthesis.ApiSecurityConfig.ACCESS_TOKEN_COOKIE_NAME;
import static pl.edu.agh.quizzesthesis.ApiSecurityConfig.REFRESH_TOKEN_COOKIE_NAME;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;
    private final Duration accessTokenDuration;
    private final Duration refreshTokenDuration;

    public AuthController(AuthService authService,
                          UserMapper userMapper,
                          @Value("${jwt.access-token.duration}") Duration accessTokenDuration,
                          @Value("${jwt.refresh-token.duration}") Duration refreshTokenDuration) {
        this.authService = authService;
        this.userMapper = userMapper;
        this.accessTokenDuration = accessTokenDuration;
        this.refreshTokenDuration = refreshTokenDuration;
    }

    @GetMapping("/users/current")
    public UserResponse getCurrentUser(@Current User user) {
        return userMapper.entityToResponse(user);
    }

    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserResponse> signUp(@Valid @RequestBody SignUpRequest request, HttpServletResponse response) {
        var userAuthTriple = authService.signUp(request);
        setAuthTokensCookies(response, userAuthTriple);

        return ResponseEntity.created(URI.create("/api/auth/users"))
                .body(userAuthTriple.getLeft());
    }

    @PostMapping("/access-token")
    public UserResponse signIn(@Valid @RequestBody SignInRequest request, HttpServletResponse response) {
        var userAuthTriple = authService.signIn(request);
        setAuthTokensCookies(response, userAuthTriple);

        return userAuthTriple.getLeft();
    }

    @PostMapping("/refresh-token")
    public UserResponse refreshTokens(@Valid @RequestBody SignInRequest request,
                                      @CookieValue(name = REFRESH_TOKEN_COOKIE_NAME, defaultValue = "") String refreshToken,
                                      HttpServletResponse response) {
        var userAuthTriple = authService.refreshTokens(refreshToken);
        setAuthTokensCookies(response, userAuthTriple);

        return userAuthTriple.getLeft();
    }

    private void setAuthTokensCookies(HttpServletResponse response, Triple<UserResponse, String, String> userAuthTriple) {
        response.addCookie(generateAccessTokenCookie(userAuthTriple.getMiddle()));
        response.addCookie(generateRefreshTokenCookie(userAuthTriple.getRight()));
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
