package com.recrutement.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EntretienDTO {
    private Long candidatureId;
    private LocalDateTime dateHeure;
    private String type;
    private String salle;
    private String lienVisio;
}