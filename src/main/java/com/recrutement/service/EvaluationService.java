package com.recrutement.service;

import com.recrutement.dto.EvaluationDTO;
import com.recrutement.entity.*;
import com.recrutement.entity.enums.StatutCandidature;
import com.recrutement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final EvaluationRepository evaluationRepo;
    private final EntretienRepository entretienRepo;
    private final CandidatureRepository candidatureRepo;

    @Transactional
    public Evaluation evaluerCandidat(EvaluationDTO dto) {

        if (evaluationRepo.existsByEntretienId(dto.getEntretienId()))
            throw new RuntimeException(
                    "Une évaluation existe déjà pour cet entretien");

        Entretien entretien = entretienRepo
                .findById(dto.getEntretienId())
                .orElseThrow(() ->
                        new RuntimeException("Entretien introuvable"));

        Evaluation eval = new Evaluation();
        eval.setEntretien(entretien);
        eval.setNoteTechnique(dto.getNoteTechnique());
        eval.setNoteSoftSkills(dto.getNoteSoftSkills());
        eval.setAvisFinal(dto.getAvisFinal());
        eval.setRecommandation(dto.getRecommandation());
        eval = evaluationRepo.save(eval);

        // Valider ou refuser la candidature selon recommandation
        Candidature candidature = entretien.getCandidature();
        if (Boolean.TRUE.equals(dto.getRecommandation())) {
            candidature.changerStatut(StatutCandidature.ACCEPTEE);
        } else {
            candidature.changerStatut(StatutCandidature.REFUSEE);
        }
        candidatureRepo.save(candidature);

        return eval;
    }

    public Evaluation getEvaluationByEntretien(Long entretienId) {
        return evaluationRepo.findByEntretienId(entretienId)
                .orElseThrow(() ->
                        new RuntimeException("Evaluation introuvable"));
    }
}