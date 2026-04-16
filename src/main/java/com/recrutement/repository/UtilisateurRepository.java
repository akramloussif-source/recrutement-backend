package com.recrutement.repository;

import com.recrutement.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UtilisateurRepository
        extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByLogin(String login);

    @Query("SELECT COUNT(u) > 0 FROM Utilisateur u WHERE u.login = :login")
    boolean existsByLogin(@Param("login") String login);
}