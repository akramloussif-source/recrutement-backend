package com.recrutement.entity;

import com.recrutement.entity.enums.EtatRdv;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "ENTRETIENS")
@Data @NoArgsConstructor @AllArgsConstructor
public class Entretien {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "entr_seq")
    @SequenceGenerator(name = "entr_seq",
            sequenceName = "ENTR_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "DATE_HEURE", nullable = false)
    private LocalDateTime dateHeure;

    @Column(name = "LIEN_VISIO", length = 255)
    private String lienVisio;

    @Column(length = 100)
    private String salle;

    @Column(length = 50)
    private String type;   // PRESENTIEL / VISIO / TELEPHONIQUE

    @Enumerated(EnumType.STRING)
    @Column(name = "ETAT_RDV", length = 20)
    private EtatRdv etatRdv = EtatRdv.PLANIFIE;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CANDIDATURE_ID", nullable = false)
    private Candidature candidature;

    @JsonIgnore
    @OneToOne(mappedBy = "entretien", cascade = CascadeType.ALL)
    private Evaluation evaluation;
}
