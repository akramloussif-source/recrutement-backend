package com.recrutement.service;

import com.recrutement.dto.EntretienDTO;
import com.recrutement.entity.*;
import com.recrutement.entity.enums.EtatRdv;
import com.recrutement.entity.enums.StatutCandidature;
import com.recrutement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EntretienService {

    private final EntretienRepository entretienRepo;
    private final CandidatureRepository candidatureRepo;
    private final RecruteurRepository recruteurRepo;

    @Transactional
    public Entretien planifierEntretien(EntretienDTO dto,
                                        Long recruteurId) {

        if (entretienRepo.countByCandidatureId(dto.getCandidatureId()) > 0)
            throw new RuntimeException("Un entretien existe déjà pour cette candidature");

        if (entretienRepo.countConflitHoraire(recruteurId, dto.getDateHeure()) > 0)
            throw new RuntimeException("Conflit de créneau : un entretien existe déjà à cette heure");

        Candidature candidature = candidatureRepo
                .findById(dto.getCandidatureId())
                .orElseThrow(() ->
                        new RuntimeException("Candidature introuvable"));



        // Créer l'entretien
        Entretien entretien = new Entretien();
        entretien.setCandidature(candidature);
        entretien.setDateHeure(dto.getDateHeure());
        entretien.setType(dto.getType());
        entretien.setSalle(dto.getSalle());
        entretien.setLienVisio(dto.getLienVisio());
        entretien.setEtatRdv(EtatRdv.PLANIFIE);
        entretien = entretienRepo.save(entretien);

        // Mettre la candidature EN_COURS
        candidature.changerStatut(StatutCandidature.EN_COURS);
        candidatureRepo.save(candidature);

        return entretien;
    }

    @Transactional
    public Entretien modifierEtat(Long entretienId, EtatRdv nouvelEtat) {
        Entretien e = entretienRepo.findById(entretienId)
                .orElseThrow(() ->
                        new RuntimeException("Entretien introuvable"));
        e.setEtatRdv(nouvelEtat);
        return entretienRepo.save(e);
    }

    public List<Entretien> getMesEntretiens(Long candidatId) {
        return entretienRepo.findByCandidatureCandidatId(candidatId);
    }

    public List<Entretien> getEntretiensByRecruteur(Long recruteurId) {
        return entretienRepo
                .findByCandidatureOffreRecruteurId(recruteurId);
    }
}