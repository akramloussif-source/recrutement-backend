package com.recrutement.dto;

import lombok.Data;

@Data
public class RegisterRecruteurDTO {
    private String login;
    private String password;
    private String email;
    private String nomEntreprise;
    private String poste;
}