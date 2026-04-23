package com.recrutement.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.recrutement.entity.*;
import com.recrutement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final EvaluationRepository evaluationRepo;
    private final EntretienRepository entretienRepo;
    private final CandidatureRepository candidatureRepo;

    // ── Couleurs ────────────────────────────────────────────────────────────────
    private static final BaseColor DARK_BLUE  = new BaseColor(26, 26, 46);
    private static final BaseColor LIGHT_GRAY = new BaseColor(245, 245, 245);
    private static final BaseColor GREEN      = new BaseColor(39, 174, 96);
    private static final BaseColor RED        = new BaseColor(231, 76, 60);
    private static final BaseColor BORDER     = new BaseColor(200, 200, 200);

    // ── Fonts ───────────────────────────────────────────────────────────────────
    private static final Font FONT_TITLE  = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD, BaseColor.WHITE);
    private static final Font FONT_H2     = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, DARK_BLUE);
    private static final Font FONT_NORMAL = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL, BaseColor.DARK_GRAY);
    private static final Font FONT_BOLD   = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, DARK_BLUE);
    private static final Font FONT_SMALL  = new Font(Font.FontFamily.HELVETICA, 9,  Font.NORMAL, BaseColor.GRAY);

    public byte[] genererRapportEvaluation(Long evaluationId) throws Exception {
        Evaluation eval = evaluationRepo.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Evaluation introuvable"));

        Entretien entretien = eval.getEntretien();
        Candidature candidature = entretien.getCandidature();
        Candidat candidat = candidature.getCandidat();
        OffreEmploi offre = candidature.getOffre();
        Recruteur recruteur = offre.getRecruteur();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        com.itextpdf.text.Document doc = new com.itextpdf.text.Document(PageSize.A4, 50, 50, 50, 50);        PdfWriter writer = PdfWriter.getInstance(doc, baos);

// Footer
        writer.setPageEvent(new PdfPageEventHelper() {
            @Override
            // On précise bien com.itextpdf.text.Document ici pour que l'override soit valide
            public void onEndPage(PdfWriter w, com.itextpdf.text.Document d) {
                try {
                    PdfContentByte cb = w.getDirectContent();
                    Phrase footer = new Phrase(
                            "Système de Gestion de Recrutement — Document généré automatiquement",
                            FONT_SMALL);
                    ColumnText.showTextAligned(cb, Element.ALIGN_CENTER, footer,
                            (d.right() + d.left()) / 2, d.bottom() - 10, 0);
                } catch (Exception ignored) {}
            }
        });

        doc.open();

        // ── HEADER ──────────────────────────────────────────────────────────────
        PdfPTable header = new PdfPTable(1);
        header.setWidthPercentage(100);
        PdfPCell headerCell = new PdfPCell();
        headerCell.setBackgroundColor(DARK_BLUE);
        headerCell.setPadding(20);
        headerCell.setBorder(Rectangle.NO_BORDER);

        Paragraph titre = new Paragraph("RAPPORT D'ÉVALUATION", FONT_TITLE);
        titre.setAlignment(Element.ALIGN_CENTER);
        headerCell.addElement(titre);

        Paragraph sousTitre = new Paragraph(
                offre.getTitre() + " — " + recruteur.getNomEntreprise(),
                new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, new BaseColor(180, 180, 180)));
        sousTitre.setAlignment(Element.ALIGN_CENTER);
        headerCell.addElement(sousTitre);

        header.addCell(headerCell);
        doc.add(header);
        doc.add(Chunk.NEWLINE);

        // ── INFOS CANDIDAT ──────────────────────────────────────────────────────
        doc.add(sectionTitle("Informations du Candidat"));
        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);
        infoTable.setSpacingBefore(8);
        infoTable.setSpacingAfter(16);

        addRow(infoTable, "Nom complet", candidat.getNom() + " " + candidat.getPrenom());
        addRow(infoTable, "Email", candidat.getEmail());
        addRow(infoTable, "Téléphone", candidat.getTelephone() != null ? candidat.getTelephone() : "—");
        addRow(infoTable, "Diplôme", candidat.getDernierDiplome() != null ? candidat.getDernierDiplome() : "—");
        addRow(infoTable, "Expérience", candidat.getAnneesExperience() != null ?
                candidat.getAnneesExperience() + " an(s)" : "—");
        doc.add(infoTable);

        // ── INFOS OFFRE ─────────────────────────────────────────────────────────
        doc.add(sectionTitle("Poste Concerné"));
        PdfPTable offreTable = new PdfPTable(2);
        offreTable.setWidthPercentage(100);
        offreTable.setSpacingBefore(8);
        offreTable.setSpacingAfter(16);

        addRow(offreTable, "Titre du poste", offre.getTitre());
        addRow(offreTable, "Entreprise", recruteur.getNomEntreprise());
        addRow(offreTable, "Type de contrat", offre.getTypeContrat());
        addRow(offreTable, "Salaire proposé", offre.getSalairePropose() + " €/mois");
        doc.add(offreTable);

        // ── INFOS ENTRETIEN ─────────────────────────────────────────────────────
        doc.add(sectionTitle("Détails de l'Entretien"));
        PdfPTable entretienTable = new PdfPTable(2);
        entretienTable.setWidthPercentage(100);
        entretienTable.setSpacingBefore(8);
        entretienTable.setSpacingAfter(16);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm");
        addRow(entretienTable, "Date et heure", entretien.getDateHeure().format(fmt));
        addRow(entretienTable, "Type", entretien.getType());
        addRow(entretienTable, "Lieu/Salle", entretien.getSalle() != null ? entretien.getSalle() : "—");
        addRow(entretienTable, "Lien visio", entretien.getLienVisio() != null ? entretien.getLienVisio() : "—");
        addRow(entretienTable, "Statut", entretien.getEtatRdv().name());
        doc.add(entretienTable);

        // ── NOTES ───────────────────────────────────────────────────────────────
        doc.add(sectionTitle("Résultats de l'Évaluation"));
        doc.add(Chunk.NEWLINE);

        // Barres de score
        doc.add(scoreBar("Note Technique", eval.getNoteTechnique(), 20));
        doc.add(Chunk.NEWLINE);
        doc.add(scoreBar("Note Soft Skills", eval.getNoteSoftSkills(), 20));
        doc.add(Chunk.NEWLINE);

        // Score global
        double scoreGlobal = (eval.getNoteTechnique() + eval.getNoteSoftSkills()) / 2.0;
        PdfPTable scoreTable = new PdfPTable(1);
        scoreTable.setWidthPercentage(100);
        scoreTable.setSpacingBefore(10);
        PdfPCell scoreCell = new PdfPCell();
        scoreCell.setBackgroundColor(LIGHT_GRAY);
        scoreCell.setPadding(12);
        scoreCell.setBorderColor(BORDER);
        Paragraph scoreP = new Paragraph(
                String.format("Score Global : %.1f / 20", scoreGlobal),
                new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, DARK_BLUE));
        scoreP.setAlignment(Element.ALIGN_CENTER);
        scoreCell.addElement(scoreP);
        scoreTable.addCell(scoreCell);
        doc.add(scoreTable);
        doc.add(Chunk.NEWLINE);

        // ── AVIS FINAL ──────────────────────────────────────────────────────────
        doc.add(sectionTitle("Avis Final"));
        PdfPTable avisTable = new PdfPTable(1);
        avisTable.setWidthPercentage(100);
        avisTable.setSpacingBefore(8);
        avisTable.setSpacingAfter(16);
        PdfPCell avisCell = new PdfPCell();
        avisCell.setPadding(12);
        avisCell.setBorderColor(BORDER);
        avisCell.addElement(new Paragraph(eval.getAvisFinal(), FONT_NORMAL));
        avisTable.addCell(avisCell);
        doc.add(avisTable);

        // ── RECOMMANDATION ──────────────────────────────────────────────────────
        PdfPTable recommTable = new PdfPTable(1);
        recommTable.setWidthPercentage(100);
        recommTable.setSpacingBefore(8);
        PdfPCell recommCell = new PdfPCell();
        boolean recommande = Boolean.TRUE.equals(eval.getRecommandation());
        recommCell.setBackgroundColor(recommande ? GREEN : RED);
        recommCell.setPadding(16);
        recommCell.setBorder(Rectangle.NO_BORDER);
        Paragraph recommP = new Paragraph(
                recommande ? "✔  CANDIDAT RECOMMANDÉ" : "✘  CANDIDAT NON RECOMMANDÉ",
                new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, BaseColor.WHITE));
        recommP.setAlignment(Element.ALIGN_CENTER);
        recommCell.addElement(recommP);
        recommTable.addCell(recommCell);
        doc.add(recommTable);

        doc.close();
        return baos.toByteArray();
    }

    // ── Helpers ─────────────────────────────────────────────────────────────────

    private Paragraph sectionTitle(String text) {
        Paragraph p = new Paragraph(text, FONT_H2);
        p.setSpacingBefore(12);
        p.setSpacingAfter(4);
        return p;
    }

    private void addRow(PdfPTable table, String label, String value) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, FONT_BOLD));
        labelCell.setBackgroundColor(LIGHT_GRAY);
        labelCell.setPadding(8);
        labelCell.setBorderColor(BORDER);

        PdfPCell valueCell = new PdfPCell(new Phrase(value != null ? value : "—", FONT_NORMAL));
        valueCell.setPadding(8);
        valueCell.setBorderColor(BORDER);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private PdfPTable scoreBar(String label, int score, int max) throws Exception {
        PdfPTable t = new PdfPTable(new float[]{3, 7, 1});
        t.setWidthPercentage(100);

        PdfPCell labelCell = new PdfPCell(new Phrase(label, FONT_BOLD));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(4);
        t.addCell(labelCell);

        // Barre de progression
        PdfPTable barContainer = new PdfPTable(new float[]{score, max - score});
        barContainer.setWidthPercentage(100);
        PdfPCell filled = new PdfPCell();
        filled.setBackgroundColor(score >= 14 ? GREEN : score >= 10 ? new BaseColor(241, 196, 15) : RED);
        filled.setFixedHeight(16);
        filled.setBorder(Rectangle.NO_BORDER);
        barContainer.addCell(filled);
        if (score < max) {
            PdfPCell empty = new PdfPCell();
            empty.setBackgroundColor(LIGHT_GRAY);
            empty.setFixedHeight(16);
            empty.setBorder(Rectangle.NO_BORDER);
            barContainer.addCell(empty);
        }
        PdfPCell barCell = new PdfPCell(barContainer);
        barCell.setBorder(Rectangle.NO_BORDER);
        barCell.setPaddingTop(6);
        t.addCell(barCell);

        PdfPCell scoreCell = new PdfPCell(new Phrase(score + "/" + max, FONT_BOLD));
        scoreCell.setBorder(Rectangle.NO_BORDER);
        scoreCell.setPadding(4);
        scoreCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        t.addCell(scoreCell);

        return t;
    }
}