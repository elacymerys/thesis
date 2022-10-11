package pl.edu.agh.quizzesthesis.api.dto;

import java.util.List;

public record PictureQuestionResponse(PictureWithAuthorResponse question, TermResponse correct,
                                      List<String> answers) {
}
