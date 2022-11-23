package pl.edu.agh.quizzesthesis.api.dto;

import java.util.List;

public record QuestionsSetResponse(String questionsSetName, List<TeacherQuestionResponse> teacherQuestionsResponse) {}
