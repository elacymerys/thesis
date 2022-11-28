package pl.edu.agh.quizzesthesis.api.dto;

import java.util.Map;

public record UserResponse(
        int id,
        String nick,
        String email,
        Map<Integer, Float> categoryRanks,
        Map<Integer, Long> categoryTotalAnswersCounter
) {}
