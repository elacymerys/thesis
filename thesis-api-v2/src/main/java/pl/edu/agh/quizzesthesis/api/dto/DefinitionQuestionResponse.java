package pl.edu.agh.quizzesthesis.api.dto;

import java.util.List;

public record DefinitionQuestionResponse(String question, TermResponse correct, List<String> answers) {}
