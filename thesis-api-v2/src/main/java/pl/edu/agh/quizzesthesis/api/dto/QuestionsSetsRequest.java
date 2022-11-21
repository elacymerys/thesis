package pl.edu.agh.quizzesthesis.api.dto;

import java.util.List;

public record QuestionsSetsRequest(String questionsSetName, List<TeacherQuestionRequest> teacherQuestionsRequest) {}
