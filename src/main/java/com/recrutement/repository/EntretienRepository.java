package com.recrutement.repository;

import com.recrutement.entity.Entretien;
import com.recrutement.entity.enums.EtatRdv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface EntretienRepository
        extends JpaRepository<Entretien, Long> {

    List<Entretien> findByCandidatureId(Long candidatureId);

    List<Entretien> findByCandidatureCandidatId(Long candidatId);

    List<Entretien> findByCandidatureOffreRecruteurId(Long recruteurId);

    @Query("SELECT COUNT(e) > 0 FROM Entretien e " +
            "WHERE e.candidature.offre.recruteur.id = :recruteurId " +
            "AND e.dateHeure = :dateHeure " +
            "AND e.etatRdv <> 'ANNULE'")
    Boolean existsConflitHoraire(Long recruteurId,
                                 LocalDateTime dateHeure);

    List<Entretien> findByEtatRdv(EtatRdv etatRdv);
}