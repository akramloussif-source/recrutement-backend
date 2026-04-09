package com.recrutement.dto;

import lombok.Data;

@Data
public class EvaluationDTO {
    private Long entretienId;
    private Integer noteTechnique;
    private Integer noteSoftSkills;
    private String avisFinal;
    private Boolean recommandation;
}