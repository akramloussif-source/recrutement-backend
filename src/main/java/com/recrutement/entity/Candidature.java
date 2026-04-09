package com.recrutement.entity;

import com.recrutement.entity.enums.StatutCandidature;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "CANDIDATURES",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"CANDIDAT_ID", "OFFRE_ID"}))
@Data @NoArgsConstructor @AllArgsConstructor
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "cand_seq")
    @SequenceGenerator(name = "cand_seq",
            sequenceName = "CAND_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "DATE_POSTULATION")
    private LocalDate datePostulation = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUT_ACTUEL", length = 20)
    private StatutCandidature statutActuel = StatutCandidature.EN_ATTENTE;

    @Column(name = "LETTRE_MOTIVATION", length = 2000)
    private String lettreMotivation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CANDIDAT_ID", nullable = false)
    private Candidat candidat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OFFRE_ID", nullable = false)
    private OffreEmploi offre;

    @OneToMany(mappedBy = "candidature", cascade = CascadeType.ALL)
    private List<Document> documents;

    @OneToMany(mappedBy = "candidature", cascade = CascadeType.ALL)
    private List<Entretien> entretiens;

    public void changerStatut(StatutCandidature nouveauStatut) {
        this.statutActuel = nouveauStatut;
    }
}
