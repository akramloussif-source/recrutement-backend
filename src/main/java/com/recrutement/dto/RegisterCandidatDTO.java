package com.recrutement.dto;

import lombok.Data;

@Data
public class RegisterCandidatDTO {
    private String login;
    private String password;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private String dernierDiplome;
    private Integer anneesExperience;
}