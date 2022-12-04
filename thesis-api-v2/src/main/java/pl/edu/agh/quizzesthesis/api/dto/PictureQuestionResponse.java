package pl.edu.agh.quizzesthesis.api.dto;

import java.util.List;

public record PictureQuestionResponse(int type, String question, TermResponse correct, List<String> answers,
                                      String authorName, String authorProfileURL) {
}
