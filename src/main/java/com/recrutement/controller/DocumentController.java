package com.recrutement.controller;

import com.recrutement.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @GetMapping("/evaluation/{evaluationId}/pdf")
    @PreAuthorize("hasRole('RECRUTEUR')")
    public ResponseEntity<byte[]> telechargerRapport(
            @PathVariable Long evaluationId) throws Exception {

        byte[] pdf = documentService.genererRapportEvaluation(evaluationId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"rapport_evaluation_" + evaluationId + ".pdf\"")
                .body(pdf);
    }
}