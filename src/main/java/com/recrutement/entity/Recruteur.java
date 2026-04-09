package com.recrutement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "RECRUTEURS")
@DiscriminatorValue("RECRUTEUR")
@Data @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Recruteur extends Utilisateur {

    @Column(name = "NOM_ENTREPRISE", length = 150)
    private String nomEntreprise;

    @Column(length = 100)
    private String poste;

    @Column(nullable = false, unique = true, length = 150)
    private String email;
}
