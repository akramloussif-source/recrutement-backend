package com.recrutement.controller;

import com.recrutement.dto.CandidatureDTO;
import com.recrutement.entity.Candidature;
import com.recrutement.entity.enums.StatutCandidature;
import com.recrutement.service.CandidatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/candidatures")
@RequiredArgsConstructor
public class CandidatureController {

    private final CandidatureService candidatureService;

    @PostMapping("/postuler")
    @PreAuthorize("hasRole('CANDIDAT')")
    public ResponseEntity<Candidature> postuler(
            @RequestParam Long offreId,
            @RequestParam(required = false) String lettreMotivation,
            @RequestParam(value = "cv", required = false) MultipartFile cvFile,
            Authentication auth) throws Exception {

        Long candidatId = (Long) auth.getPrincipal();

        // Crée un DTO manuellement
        CandidatureDTO dto = new CandidatureDTO();
        dto.setOffreId(offreId);
        dto.setLettreMotivation(lettreMotivation);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(candidatureService.postuler(dto, candidatId, cvFile));
    }

    @GetMapping("/mes-candidatures")
    public ResponseEntity<List<Candidature>> mesCandidatures(
            Authentication auth) {
        Long candidatId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(
                candidatureService.getMesCandidatures(candidatId));
    }

    @GetMapping("/offre/{offreId}")
    public ResponseEntity<List<Candidature>> byOffre(
            @PathVariable Long offreId) {
        return ResponseEntity.ok(
                candidatureService.getCandidaturesByOffre(offreId));
    }

    @GetMapping("/recruteur")
    public ResponseEntity<List<Candidature>> byRecruteur(
            Authentication auth) {
        Long recruteurId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(
                candidatureService.getCandidaturesByRecruteur(recruteurId));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Candidature> changerStatut(
            @PathVariable Long id,
            @RequestParam StatutCandidature statut) {
        return ResponseEntity.ok(
                candidatureService.changerStatut(id, statut));
    }
}