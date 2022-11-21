package pl.edu.agh.quizzesthesis.api.dto;

import java.util.List;

public record TeacherQuestionResponse(String question, String correct, List<String> answers) {}
