package pl.edu.agh.quizzesthesis.business.service;

import lombok.AllArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.quizzesthesis.api.dto.SignInRequest;
import pl.edu.agh.quizzesthesis.api.dto.SignUpRequest;
import pl.edu.agh.quizzesthesis.api.dto.UserResponse;
import pl.edu.agh.quizzesthesis.business.exception.AuthTokenInvalidException;
import pl.edu.agh.quizzesthesis.business.exception.ConflictException;
import pl.edu.agh.quizzesthesis.business.exception.UnknownUserException;
import pl.edu.agh.quizzesthesis.business.mapper.UserMapper;
import pl.edu.agh.quizzesthesis.data.entity.User;
import pl.edu.agh.quizzesthesis.data.repository.UserRepository;

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
    public UserResponse getUser(int id) {
        var user = userRepository.findById(id).orElseThrow(() -> new UnknownUserException("Cannot find user by id " + id));
        return mapper.entityToResponse(user);
    }

    @Transactional
    public UserAuthTriple signUp(SignUpRequest request) {
        if (userRepository.existsByNick(request.nick())) {
            throw new ConflictException("User with nick %s already exists".formatted(request.nick()));
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("User with email %s already exists".formatted(request.email()));
        }

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
    public UserAuthTriple signIn(SignInRequest request) {
        var user = userRepository.findOneByNickOrEmail(request.login()).orElseThrow(() -> new BadCredentialsException("Wrong login"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Wrong password");
        }

        return createUserAuthTriple(user);
    }

    public UserAuthTriple refreshTokens(String refreshToken) {
        var userAuthDetails = jwtService.verifyRefreshToken(refreshToken)
                .orElseThrow(() -> new AuthTokenInvalidException("Invalid refresh token"));

        var user = userRepository.findById(userAuthDetails.id())
                .orElseThrow(() -> new UnknownUserException("Cannot find user " + userAuthDetails.nick()));

        return createUserAuthTriple(user);
    }

    private UserAuthTriple createUserAuthTriple(User user) {
        var userAuthDetails = mapper.entityToAuthDetails(user);
        return new UserAuthTriple(mapper.entityToResponse(user),
                                  jwtService.createAccessToken(userAuthDetails),
                                  jwtService.createRefreshToken(userAuthDetails));
    }

    public record UserAuthTriple(UserResponse userResponse, String accessToken, String refreshToken) {}
}
