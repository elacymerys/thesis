package pl.edu.agh.quizzesthesis.data.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SearchPhrase {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String searchWord;
    private Integer noOfRecords;

    @ManyToOne
    private Category category;



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SearchPhrase searchPhrase = (SearchPhrase) o;
        return Objects.equals(id, searchPhrase.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
