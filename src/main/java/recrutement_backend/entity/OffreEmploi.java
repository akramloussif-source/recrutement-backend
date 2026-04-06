package recrutement_backend.entity;

import com.recrutement.entity.enums.StatutOffre;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "OFFRES_EMPLOI")
@Data @NoArgsConstructor @AllArgsConstructor
public class OffreEmploi {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "offre_seq")
    @SequenceGenerator(name = "offre_seq",
            sequenceName = "OFFRE_SEQ", allocationSize = 1)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titre;

    @Column(length = 2000)
    private String description;

    @Column(name = "DATE_PUBLICATION")
    private LocalDate datePublication;

    @Column(name = "DATE_LIMITE")
    private LocalDate dateLimite;

    @Column(name = "SALAIRE_PROPOSE")
    private Double salairePropose;

    @Column(name = "TYPE_CONTRAT", length = 50)
    private String typeContrat;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private StatutOffre statut = StatutOffre.OUVERTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RECRUTEUR_ID", nullable = false)
    private Recruteur recruteur;

    @OneToMany(mappedBy = "offre", cascade = CascadeType.ALL)
    private List<Candidature> candidatures;
}
