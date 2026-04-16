package com.recrutement.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@Entity
@Table(name = "CANDIDATS")
@DiscriminatorValue("CANDIDAT")
@Data @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

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
