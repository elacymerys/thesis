package pl.edu.agh.quizzesthesis.data.entity;

import lombok.*;

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
    private Long wrongAnswersCounter;
    private Long totalAnswersCounter;
    private Long flagCounter;
    private Float difficulty;
    private String pictureURL;
    private String authorName;

    @ManyToOne
    private SearchPhrase searchPhrase;

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
