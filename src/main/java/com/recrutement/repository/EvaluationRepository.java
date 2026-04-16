package com.recrutement.repository;

import com.recrutement.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EvaluationRepository
        extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findByEntretienId(Long entretienId);
    @Query("SELECT COUNT(e) > 0 FROM Evaluation e WHERE e.entretien.id = :entretienId")
    boolean existsByEntretienId(@Param("entretienId") Long entretienId);}