package com.recrutement.repository;

import com.recrutement.entity.Candidat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface CandidatRepository extends JpaRepository<Candidat, Long> {

    @Query("SELECT c FROM Candidat c WHERE c.email = :email")
    Optional<Candidat> findByEmail(@Param("email") String email);

    @Query("SELECT c FROM Candidat c WHERE c.login = :login")
    Optional<Candidat> findByLogin(@Param("login") String login);
}