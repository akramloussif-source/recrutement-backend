package com.recrutement.repository;

import com.recrutement.entity.OffreEmploi;
import com.recrutement.entity.enums.StatutOffre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OffreEmploiRepository
        extends JpaRepository<OffreEmploi, Long> {

    List<OffreEmploi> findByStatut(StatutOffre statut);

    List<OffreEmploi> findByRecruteurId(Long recruteurId);

    @Query("SELECT o FROM OffreEmploi o WHERE o.statut = 'OUVERTE' " +
            "AND (LOWER(o.titre) LIKE LOWER(CONCAT('%',:keyword,'%')) " +
            "OR LOWER(o.description) LIKE LOWER(CONCAT('%',:keyword,'%')))")
    List<OffreEmploi> searchByKeyword(String keyword);
}

