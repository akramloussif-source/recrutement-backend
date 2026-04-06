package recrutement_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CANDIDATS")
@DiscriminatorValue("CANDIDAT")
@Data @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Candidat extends Utilisateur {

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 20)
    private String telephone;

    @Column(length = 255)
    private String adresse;

    @Column(name = "DERNIER_DIPLOME", length = 100)
    private String dernierDiplome;

    @Column(name = "ANNEES_EXPERIENCE")
    private Integer anneesExperience;
}
