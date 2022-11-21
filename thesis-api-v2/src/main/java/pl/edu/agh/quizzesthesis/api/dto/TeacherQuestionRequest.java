package pl.edu.agh.quizzesthesis.api.dto;

import java.util.List;

public record TeacherQuestionRequest(String question, String correct, List<String> answers) {}
