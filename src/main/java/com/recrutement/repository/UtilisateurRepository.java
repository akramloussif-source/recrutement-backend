package com.recrutement.repository;

import com.recrutement.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UtilisateurRepository
        extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByLogin(String login);
    Boolean existsByLogin(String login);
}