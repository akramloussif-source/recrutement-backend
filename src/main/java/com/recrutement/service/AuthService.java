package com.recrutement.service;

import com.recrutement.dto.*;
import com.recrutement.entity.*;
import com.recrutement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CandidatRepository candidatRepo;
    private final RecruteurRepository recruteurRepo;
    private final UtilisateurRepository utilisateurRepo;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Candidat inscrireCandidat(RegisterCandidatDTO dto) {
        if (candidatRepo.findByEmail(dto.getEmail()).isPresent())
            throw new RuntimeException("Email déjà utilisé");

        if (utilisateurRepo.existsByLogin(dto.getLogin()))
            throw new RuntimeException("Login déjà utilisé");

        Candidat c = new Candidat();
        c.setLogin(dto.getLogin());
        c.setPassword(passwordEncoder.encode(dto.getPassword()));
        c.setRole("CANDIDAT");
        c.setNom(dto.getNom());
        c.setPrenom(dto.getPrenom());
        c.setEmail(dto.getEmail());
        c.setTelephone(dto.getTelephone());
        c.setAdresse(dto.getAdresse());
        c.setDernierDiplome(dto.getDernierDiplome());
        c.setAnneesExperience(dto.getAnneesExperience());
        return candidatRepo.save(c);
    }

    @Transactional
    public Recruteur inscrireRecruteur(RegisterRecruteurDTO dto) {
        if (recruteurRepo.findByEmail(dto.getEmail()).isPresent())
            throw new RuntimeException("Email déjà utilisé");

        if (utilisateurRepo.existsByLogin(dto.getLogin()))
            throw new RuntimeException("Login déjà utilisé");

        Recruteur r = new Recruteur();
        r.setLogin(dto.getLogin());
        r.setPassword(passwordEncoder.encode(dto.getPassword()));
        r.setRole("RECRUTEUR");
        r.setEmail(dto.getEmail());
        r.setNomEntreprise(dto.getNomEntreprise());
        r.setPoste(dto.getPoste());
        return recruteurRepo.save(r);
    }
}