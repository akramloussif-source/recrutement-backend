package com.recrutement.controller;

import com.recrutement.dto.EvaluationDTO;
import com.recrutement.entity.Evaluation;
import com.recrutement.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @PostMapping
    public ResponseEntity<Evaluation> evaluer(
            @RequestBody EvaluationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(evaluationService.evaluerCandidat(dto));
    }

    @GetMapping("/entretien/{entretienId}")
    public ResponseEntity<Evaluation> getByEntretien(
            @PathVariable Long entretienId) {
        return ResponseEntity.ok(
                evaluationService.getEvaluationByEntretien(entretienId));
    }
}