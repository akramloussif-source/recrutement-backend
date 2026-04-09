package com.recrutement.repository;

import com.recrutement.entity.Candidat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidatRepository extends JpaRepository<Candidat, Long> {
    // Magie : Grâce à JpaRepository, tu as déjà les méthodes
    // save(), findAll(), deleteById(), etc. sans rien écrire !
}