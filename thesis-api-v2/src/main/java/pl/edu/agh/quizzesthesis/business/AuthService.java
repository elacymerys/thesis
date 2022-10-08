package pl.edu.agh.quizzesthesis.business;

import lombok.AllArgsConstructor;
import org.apache.commons.lang3.tuple.Triple;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.SignInRequest;
import pl.edu.agh.quizzesthesis.api.dto.SignUpRequest;
import pl.edu.agh.quizzesthesis.api.dto.UserResponse;
import pl.edu.agh.quizzesthesis.business.exception.AuthTokenInvalidException;
import pl.edu.agh.quizzesthesis.business.mapper.UserMapper;
import pl.edu.agh.quizzesthesis.data.UserRepository;
import pl.edu.agh.quizzesthesis.data.entity.User;

import static java.util.stream.Collectors.toUnmodifiableMap;

@Service
@AllArgsConstructor
public class AuthService {

    private final CategoryService categoryService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper mapper;

    @Transactional
    public Triple<UserResponse, String, String> signUp(SignUpRequest request) {
        var emptyCounters = categoryService.getAll().stream()
                .collect(toUnmodifiableMap(category -> category, category -> 0L));

        var emptyCategoryRanks = categoryService.getAll().stream()
                .collect(toUnmodifiableMap(category -> category, category -> 0.0f));

        var user = userRepository.save(new User(null,
                                                      request.nick(),
                                                      request.email(),
                                                      passwordEncoder.encode(request.password()),
                                                      emptyCounters,
                                                      emptyCounters,
                                                      emptyCategoryRanks));

        return createUserAuthTriple(user);

    }

    @Transactional
    public Triple<UserResponse, String, String> signIn(SignInRequest request) {
        var user = userRepository.findOneByNickOrEmail(request.login()).orElseThrow(() -> new BadCredentialsException("Wrong login"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Wrong password");
        }

        return createUserAuthTriple(user);
    }

    public Triple<UserResponse, String, String> refreshTokens(String refreshToken) {
        var user = jwtService.verifyRefreshToken(refreshToken).orElseThrow(() -> new AuthTokenInvalidException("Invalid refresh token"));
        return createUserAuthTriple(user);
    }

    private Triple<UserResponse, String, String> createUserAuthTriple(User user) {
        return Triple.of(mapper.entityToResponse(user),
                jwtService.createAccessToken(user),
                jwtService.createRefreshToken(user));
    }
}
