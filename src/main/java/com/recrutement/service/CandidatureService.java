package com.recrutement.service;

import com.recrutement.dto.CandidatureDTO;
import com.recrutement.entity.*;
import com.recrutement.entity.enums.StatutCandidature;
import com.recrutement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CandidatureService {

    private final CandidatureRepository candidatureRepo;
    private final CandidatRepository candidatRepo;
    private final OffreEmploiRepository offreRepo;
    private final DocumentRepository documentRepo;

    private final String UPLOAD_DIR = "uploads/cv/";

    @Transactional
    public Candidature postuler(CandidatureDTO dto,
                                Long candidatId,
                                MultipartFile cvFile) throws IOException {

        // Vérifier doublon
        if (candidatureRepo.existsByCandidatIdAndOffreId(
                candidatId, dto.getOffreId()))
            throw new RuntimeException(
                    "Vous avez déjà postulé à cette offre");

        Candidat candidat = candidatRepo.findById(candidatId)
                .orElseThrow(() -> new RuntimeException("Candidat introuvable"));

        OffreEmploi offre = offreRepo.findById(dto.getOffreId())
                .orElseThrow(() -> new RuntimeException("Offre introuvable"));

        // Créer la candidature
        Candidature candidature = new Candidature();
        candidature.setCandidat(candidat);
        candidature.setOffre(offre);
        candidature.setLettreMotivation(dto.getLettreMotivation());
        candidature.setDatePostulation(LocalDate.now());
        candidature.setStatutActuel(StatutCandidature.EN_ATTENTE);
        candidature = candidatureRepo.save(candidature);

        // Enregistrer le CV si fourni
        if (cvFile != null && !cvFile.isEmpty()) {
            String url = sauvegarderFichier(cvFile, candidatId);
            Document doc = new Document();
            doc.setNomFichier(cvFile.getOriginalFilename());
            doc.setTypeDoc("CV");
            doc.setUrlStockage(url);
            doc.setDateGeneration(LocalDate.now());
            doc.setCandidature(candidature);
            documentRepo.save(doc);
        }

        return candidature;
    }

    @Transactional
    public Candidature changerStatut(Long candidatureId,
                                     StatutCandidature nouveauStatut) {
        Candidature c = candidatureRepo.findById(candidatureId)
                .orElseThrow(() ->
                        new RuntimeException("Candidature introuvable"));
        c.changerStatut(nouveauStatut);
        return candidatureRepo.save(c);
    }

    public List<Candidature> getMesCandidatures(Long candidatId) {
        return candidatureRepo.findByCandidatIdWithOffreAndRecruteur(candidatId);
    }

    public List<Candidature> getCandidaturesByOffre(Long offreId) {
        return candidatureRepo.findByOffreId(offreId);
    }

    public List<Candidature> getCandidaturesByRecruteur(Long recruteurId) {
        return candidatureRepo.findByOffreRecruteurId(recruteurId);
    }

    private String sauvegarderFichier(MultipartFile file,
                                      Long candidatId) throws IOException {
        Files.createDirectories(Paths.get(UPLOAD_DIR));
        String filename = candidatId + "_" +
                UUID.randomUUID() + "_" +
                file.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + filename);
        Files.copy(file.getInputStream(), path,
                StandardCopyOption.REPLACE_EXISTING);
        return UPLOAD_DIR + filename;
    }
}