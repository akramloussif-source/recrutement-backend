package com.recrutement.repository;

import com.recrutement.entity.Recruteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface RecruteurRepository extends JpaRepository<Recruteur, Long> {

    @Query("SELECT r FROM Recruteur r WHERE r.email = :email")
    Optional<Recruteur> findByEmail(@Param("email") String email);

    @Query("SELECT r FROM Recruteur r WHERE r.login = :login")
    Optional<Recruteur> findByLogin(@Param("login") String login);
}