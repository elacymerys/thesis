package pl.edu.agh.quizzesthesis.data.entity;

import lombok.*;
import org.springframework.boot.context.properties.bind.DefaultValue;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.Objects;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Term {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String name;
    private Float initialDifficulty;
    private Long correctAnswersCounter;
    private Long totalAnswersCounter;
    private Float difficulty;
    private String pictureURL;
    private String authorName;

    @ManyToOne
    private Category category;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Term term = (Term) o;
        return Objects.equals(id, term.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
