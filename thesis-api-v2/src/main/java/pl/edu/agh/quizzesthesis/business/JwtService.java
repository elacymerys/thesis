package pl.edu.agh.quizzesthesis.business;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier.BaseVerification;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pl.edu.agh.quizzesthesis.data.entity.User;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

@Service
public class JwtService {

    private static final String USER_ID_CLAIM = "userId";

    private final JWTVerifier accessTokenVerifier;
    private final JWTVerifier refreshTokenVerifier;
    private final Algorithm accessTokenAlgorithm;
    private final Algorithm refreshTokenAlgorithm;
    private final Duration accessTokenDuration;
    private final Duration refreshTokenDuration;
    private final Clock clock;

    public JwtService(Clock clock,
                      @Qualifier("accessTokenAlgorithm") Algorithm accessTokenAlgorithm,
                      @Qualifier("refreshTokenAlgorithm") Algorithm refreshTokenAlgorithm,
                      @Value("${jwt.access-token.duration}") Duration accessTokenDuration,
                      @Value("${jwt.refresh-token.duration}") Duration refreshTokenDuration) {
        accessTokenVerifier = ((BaseVerification) JWT.require(accessTokenAlgorithm)).build(clock);
        refreshTokenVerifier = ((BaseVerification) JWT.require(refreshTokenAlgorithm)).build(clock);
        this.accessTokenAlgorithm = accessTokenAlgorithm;
        this.refreshTokenAlgorithm = refreshTokenAlgorithm;
        this.accessTokenDuration = accessTokenDuration;
        this.refreshTokenDuration = refreshTokenDuration;
        this.clock = clock;
    }

    public String createAccessToken(User user) {
        return createToken(user, accessTokenAlgorithm, accessTokenDuration);
    }

    public String createRefreshToken(User user) {
        return createToken(user, refreshTokenAlgorithm, refreshTokenDuration);
    }

    public Optional<User> verifyAccessToken(String token) {
        return verifyToken(token, accessTokenVerifier);
    }

    public Optional<User> verifyRefreshToken(String token) {
        return verifyToken(token, refreshTokenVerifier);
    }

    private String createToken(User user, Algorithm algorithm, Duration duration) {
        return JWT.create()
                .withSubject(user.getNick())
                .withClaim(USER_ID_CLAIM, user.getId())
                .withExpiresAt(getDateFromNow(duration))
                .sign(algorithm);
    }

    private Optional<User> verifyToken(String token, JWTVerifier jwtVerifier) {
        try {
            var decodedToken = jwtVerifier.verify(token);

            var user = new User();
            user.setId(decodedToken.getClaim(USER_ID_CLAIM).asInt());
            user.setNick(decodedToken.getSubject());

            if (user.getId() == null || user.getNick() == null) {
                return Optional.empty();
            }

            return Optional.of(user);
        } catch (JWTVerificationException e) {
            return Optional.empty();
        }
    }

    private Instant getDateFromNow(Duration duration) {
        return Instant.now(clock).plus(duration);
    }
}
