package pl.edu.agh.quizzesthesis.data.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TeacherQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String question;
    private String correct;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> answers;

    @ManyToOne
    private QuestionsSet questionsSet;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TeacherQuestion teacherQuestion = (TeacherQuestion) o;
        return Objects.equals(id, teacherQuestion.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
