package recrutement_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "EVALUATIONS")
@Data @NoArgsConstructor @AllArgsConstructor
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "eval_seq")
    @SequenceGenerator(name = "eval_seq",
            sequenceName = "EVAL_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "NOTE_TECHNIQUE")
    private Integer noteTechnique;

    @Column(name = "NOTE_SOFT_SKILLS")
    private Integer noteSoftSkills;

    @Column(name = "AVIS_FINAL", length = 1000)
    private String avisFinal;

    @Column
    private Boolean recommandation;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ENTRETIEN_ID", nullable = false)
    private Entretien entretien;
}



