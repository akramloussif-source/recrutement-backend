package com.recrutement.repository;

import com.recrutement.entity.Recruteur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RecruteurRepository
        extends JpaRepository<Recruteur, Long> {
    Optional<Recruteur> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<Recruteur> findByLogin(String login);
}