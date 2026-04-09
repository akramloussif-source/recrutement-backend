package com.recrutement.repository;

import com.recrutement.entity.Candidature;
import com.recrutement.entity.enums.StatutCandidature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CandidatureRepository
        extends JpaRepository<Candidature, Long> {

    List<Candidature> findByCandidatId(Long candidatId);

    List<Candidature> findByOffreId(Long offreId);

    List<Candidature> findByOffreRecruteurId(Long recruteurId);

    Boolean existsByCandidatIdAndOffreId(Long candidatId, Long offreId);

    List<Candidature> findByStatutActuel(StatutCandidature statut);

    Optional<Candidature> findByCandidatIdAndOffreId(
            Long candidatId, Long offreId);
}