package com.recrutement.repository;

import com.recrutement.entity.Candidature;
import com.recrutement.entity.enums.StatutCandidature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CandidatureRepository
        extends JpaRepository<Candidature, Long> {

    List<Candidature> findByCandidatId(Long candidatId);

    List<Candidature> findByOffreId(Long offreId);

    List<Candidature> findByOffreRecruteurId(Long recruteurId);

    @Query("SELECT COUNT(c) > 0 FROM Candidature c WHERE c.candidat.id = :candidatId AND c.offre.id = :offreId")
    boolean existsByCandidatIdAndOffreId(@Param("candidatId") Long candidatId, @Param("offreId") Long offreId);

    List<Candidature> findByStatutActuel(StatutCandidature statut);

    @Query("SELECT c FROM Candidature c " +
            "JOIN FETCH c.offre o " +
            "JOIN FETCH o.recruteur " +
            "WHERE c.candidat.id = :candidatId")
    List<Candidature> findByCandidatIdWithOffreAndRecruteur(@Param("candidatId") Long candidatId);

    Optional<Candidature> findByCandidatIdAndOffreId(
            Long candidatId, Long offreId);
}