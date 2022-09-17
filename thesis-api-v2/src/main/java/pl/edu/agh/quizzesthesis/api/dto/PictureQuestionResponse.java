package pl.edu.agh.quizzesthesis.api.dto;

import java.util.List;

public record PictureQuestionResponse(TermWithPictureResponse correct,
                                      List<String> answers) {
}
