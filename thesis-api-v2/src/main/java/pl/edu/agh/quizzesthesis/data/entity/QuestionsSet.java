package pl.edu.agh.quizzesthesis.data.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.Objects;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionsSet {

    @Id
    @GeneratedValue(generator = "questions-set-key-generator")
    @GenericGenerator(name = "questions-set-key-generator",
            strategy = "pl.edu.agh.quizzesthesis.QuestionsSetKeyGenerator")
    private String questionsSetKey;

    private String questionsSetName;

    @ManyToOne
    private User user;

    private Integer numberOfQuestions;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuestionsSet questionsSet = (QuestionsSet) o;
        return Objects.equals(questionsSetKey, questionsSet.questionsSetKey);
    }

    @Override
    public int hashCode() {
        return Objects.hash(questionsSetKey);
    }
}
