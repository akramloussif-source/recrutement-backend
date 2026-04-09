package com.recrutement.controller;

import com.recrutement.config.JwtUtils;
import com.recrutement.dto.*;
import com.recrutement.entity.*;
import com.recrutement.repository.*;
import com.recrutement.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UtilisateurRepository utilisateurRepo;
    private final CandidatRepository candidatRepo;
    private final RecruteurRepository recruteurRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/register/candidat")
    public ResponseEntity<?> registerCandidat(
            @RequestBody RegisterCandidatDTO dto) {
        Candidat c = authService.inscrireCandidat(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Candidat inscrit avec succès",
                        "id", c.getId()
                ));
    }

    @PostMapping("/register/recruteur")
    public ResponseEntity<?> registerRecruteur(
            @RequestBody RegisterRecruteurDTO dto) {
        Recruteur r = authService.inscrireRecruteur(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Recruteur inscrit avec succès",
                        "id", r.getId()
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        Utilisateur user = utilisateurRepo
                .findByLogin(dto.getLogin())
                .orElseThrow(() ->
                        new RuntimeException("Login ou mot de passe incorrect"));

        if (!passwordEncoder.matches(dto.getPassword(),
                user.getPassword()))
            throw new RuntimeException("Login ou mot de passe incorrect");

        String token = jwtUtils.generateToken(
                user.getLogin(), user.getRole(), user.getId());

        // Infos supplémentaires selon le rôle
        String nom = "";
        String email = "";
        if ("CANDIDAT".equals(user.getRole())) {
            Candidat c = candidatRepo.findById(user.getId()).get();
            nom   = c.getNom() + " " + c.getPrenom();
            email = c.getEmail();
        } else if ("RECRUTEUR".equals(user.getRole())) {
            Recruteur r = recruteurRepo.findById(user.getId()).get();
            nom   = r.getNomEntreprise();
            email = r.getEmail();
        }

        return ResponseEntity.ok(Map.of(
                "token",  token,
                "role",   user.getRole(),
                "userId", user.getId(),
                "nom",    nom,
                "email",  email
        ));
    }
}