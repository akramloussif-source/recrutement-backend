package com.recrutement.controller;

import com.recrutement.entity.OffreEmploi;
import com.recrutement.service.OffreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/offres")
@RequiredArgsConstructor
public class OffreController {

    private final OffreService offreService;

    @GetMapping
    public ResponseEntity<List<OffreEmploi>> getAllOffres() {
        return ResponseEntity.ok(
                offreService.getAllOffresOuvertes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OffreEmploi> getOffre(
            @PathVariable Long id) {
        return ResponseEntity.ok(offreService.getOffreById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<OffreEmploi>> search(
            @RequestParam String keyword) {
        return ResponseEntity.ok(
                offreService.rechercherOffres(keyword));
    }

    @GetMapping("/mes-offres")
    public ResponseEntity<List<OffreEmploi>> getMesOffres(
            Authentication auth) {
        Long recruteurId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(
                offreService.getOffresByRecruteur(recruteurId));
    }

    @PostMapping("/creer")
    public ResponseEntity<OffreEmploi> creerOffre(
            @RequestBody OffreEmploi offre,
            Authentication auth) {
        Long recruteurId = (Long) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(offreService.publierOffre(offre, recruteurId));
    }

    @PutMapping("/{id}/modifier")
    public ResponseEntity<OffreEmploi> modifierOffre(
            @PathVariable Long id,
            @RequestBody OffreEmploi offre) {
        return ResponseEntity.ok(
                offreService.modifierOffre(id, offre));
    }

    @PatchMapping("/{id}/cloturer")
    public ResponseEntity<?> cloturerOffre(@PathVariable Long id) {
        offreService.cloturerOffre(id);
        return ResponseEntity.ok(
                java.util.Map.of("message", "Offre clôturée"));
    }
}