package recrutement_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "DOCUMENTS")
@Data @NoArgsConstructor @AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "doc_seq")
    @SequenceGenerator(name = "doc_seq",
            sequenceName = "DOC_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "NOM_FICHIER", nullable = false, length = 255)
    private String nomFichier;

    @Column(name = "TYPE_DOC", length = 50)
    private String typeDoc;   // CV, LETTRE, PDF_GENERATED

    @Column(name = "URL_STOCKAGE", length = 500)
    private String urlStockage;

    @Column(name = "DATE_GENERATION")
    private LocalDate dateGeneration = LocalDate.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CANDIDATURE_ID", nullable = false)
    private Candidature candidature;
}
