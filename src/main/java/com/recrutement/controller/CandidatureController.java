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

@RestController
@RequestMapping("/api/candidatures")
@RequiredArgsConstructor
public class CandidatureController {

    private final CandidatureService candidatureService;

    @PostMapping(value = "/postuler",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Candidature> postuler(
            @RequestPart("data") CandidatureDTO dto,
            @RequestPart(value = "cv", required = false)
            MultipartFile cvFile,
            Authentication auth) throws Exception {
        Long candidatId = (Long) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(candidatureService.postuler(
                        dto, candidatId, cvFile));
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