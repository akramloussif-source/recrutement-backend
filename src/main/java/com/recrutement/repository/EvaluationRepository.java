package com.recrutement.repository;

import com.recrutement.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EvaluationRepository
        extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findByEntretienId(Long entretienId);
    Boolean existsByEntretienId(Long entretienId);
}