package com.recrutement.service;

import com.recrutement.entity.OffreEmploi;
import com.recrutement.entity.Recruteur;
import com.recrutement.entity.enums.StatutOffre;
import com.recrutement.repository.OffreEmploiRepository;
import com.recrutement.repository.RecruteurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OffreService {

    private final OffreEmploiRepository offreRepo;
    private final RecruteurRepository recruteurRepo;

    public List<OffreEmploi> getAllOffresOuvertes() {
        return offreRepo.findByStatut(StatutOffre.OUVERTE);
    }

    public List<OffreEmploi> getOffresByRecruteur(Long recruteurId) {
        return offreRepo.findByRecruteurId(recruteurId);
    }

    public OffreEmploi getOffreById(Long id) {
        return offreRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Offre introuvable"));
    }

    @Transactional
    public OffreEmploi publierOffre(OffreEmploi offre, Long recruteurId) {
        Recruteur recruteur = recruteurRepo.findById(recruteurId)
                .orElseThrow(() -> new RuntimeException("Recruteur introuvable"));
        offre.setRecruteur(recruteur);
        offre.setDatePublication(LocalDate.now());
        offre.setStatut(StatutOffre.OUVERTE);
        return offreRepo.save(offre);
    }

    @Transactional
    public OffreEmploi modifierOffre(Long id, OffreEmploi updated) {
        OffreEmploi offre = getOffreById(id);
        offre.setTitre(updated.getTitre());
        offre.setDescription(updated.getDescription());
        offre.setDateLimite(updated.getDateLimite());
        offre.setSalairePropose(updated.getSalairePropose());
        offre.setTypeContrat(updated.getTypeContrat());
        return offreRepo.save(offre);
    }

    @Transactional
    public void cloturerOffre(Long id) {
        OffreEmploi offre = getOffreById(id);
        offre.setStatut(StatutOffre.FERMEE);
        offreRepo.save(offre);
    }

    public List<OffreEmploi> rechercherOffres(String keyword) {
        return offreRepo.searchByKeyword(keyword);
    }
}