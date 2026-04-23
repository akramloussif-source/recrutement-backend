package com.recrutement.repository;

import com.recrutement.entity.Entretien;
import com.recrutement.entity.enums.EtatRdv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface EntretienRepository
        extends JpaRepository<Entretien, Long> {

    List<Entretien> findByCandidatureId(Long candidatureId);

    List<Entretien> findByCandidatureCandidatId(Long candidatId);

    List<Entretien> findByCandidatureOffreRecruteurId(Long recruteurId);

    // Vérifier si un entretien existe déjà pour cette candidature (Version Native SQL)
    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END FROM entretiens WHERE candidature_id = :candidatureId", nativeQuery = true)
    int countByCandidatureId(@Param("candidatureId") Long candidatureId);

    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END FROM entretiens e " +
            "JOIN candidatures c ON e.candidature_id = c.id " +
            "JOIN offres_emploi o ON c.offre_id = o.id " +
            "WHERE o.recruteur_id = :recruteurId " +
            "AND e.date_heure = :dateHeure " +
            "AND e.etat_rdv <> 'ANNULE'", nativeQuery = true)
    int countConflitHoraire(@Param("recruteurId") Long recruteurId,
                            @Param("dateHeure") LocalDateTime dateHeure);
}