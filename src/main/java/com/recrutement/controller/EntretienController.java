package com.recrutement.controller;

import com.recrutement.dto.EntretienDTO;
import com.recrutement.entity.Entretien;
import com.recrutement.entity.enums.EtatRdv;
import com.recrutement.service.EntretienService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/entretiens")
@RequiredArgsConstructor
public class EntretienController {

    private final EntretienService entretienService;

    @PostMapping("/planifier")
    public ResponseEntity<Entretien> planifier(
            @RequestBody EntretienDTO dto,
            Authentication auth) {
        Long recruteurId = (Long) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(entretienService.planifierEntretien(
                        dto, recruteurId));
    }

    @GetMapping("/mes-entretiens")
    public ResponseEntity<List<Entretien>> mesEntretiens(
            Authentication auth) {
        Long candidatId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(
                entretienService.getMesEntretiens(candidatId));
    }

    @GetMapping("/recruteur")
    public ResponseEntity<List<Entretien>> byRecruteur(
            Authentication auth) {
        Long recruteurId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(
                entretienService.getEntretiensByRecruteur(recruteurId));
    }

    @PatchMapping("/{id}/etat")
    public ResponseEntity<Entretien> changerEtat(
            @PathVariable Long id,
            @RequestParam EtatRdv etat) {
        return ResponseEntity.ok(
                entretienService.modifierEtat(id, etat));
    }
}