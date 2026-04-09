package com.recrutement.repository;

import com.recrutement.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository
        extends JpaRepository<Document, Long> {
    List<Document> findByCandidatureId(Long candidatureId);
    List<Document> findByCandidatureIdAndTypeDoc(
            Long candidatureId, String typeDoc);
}