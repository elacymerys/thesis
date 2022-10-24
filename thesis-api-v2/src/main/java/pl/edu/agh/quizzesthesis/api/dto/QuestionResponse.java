package pl.edu.agh.quizzesthesis.api.dto;

import java.util.List;

public record QuestionResponse(int type, String question, TermResponse correct, List<String> answers,
                               AuthorResponse author) {}
