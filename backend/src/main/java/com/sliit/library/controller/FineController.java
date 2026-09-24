package com.sliit.library.controller;

import com.sliit.library.model.Fine;
import com.sliit.library.service.FineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fines")
@CrossOrigin(origins = "*")
public class FineController {

    @Autowired
    private FineService fineService;


    // =========================
    // READ - Get all fines
    // =========================
    @GetMapping
    public ResponseEntity<List<Fine>> getFines(
            @RequestParam(value = "memberId", required = false)
            Long memberId) {

        if (memberId != null) {
            return ResponseEntity.ok(
                    fineService.getFinesByMember(memberId)
            );
        }

        return ResponseEntity.ok(
                fineService.getAllFines()
        );
    }


    // =========================
    // CREATE - Create fine
    // =========================
    @PostMapping
    public ResponseEntity<?> createFine(
            @RequestBody Fine fine) {

        try {

            Fine created =
                    fineService.createFine(fine);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(created);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            e.getMessage()
                    ));
        }
    }


    // =========================
    // UPDATE - Update fine
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFine(
            @PathVariable Long id,
            @RequestBody Fine fine) {

        try {

            Fine updated =
                    fineService.updateFine(id, fine);

            return ResponseEntity.ok(updated);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            e.getMessage()
                    ));
        }
    }


    // =========================
    // UPDATE - Pay fine
    // =========================
    @PostMapping("/{id}/pay")
    public ResponseEntity<?> payFine(
            @PathVariable Long id,
            @RequestBody(required = false)
            Map<String, String> payload) {

        try {

            String paymentMethod =
                    payload != null
                            ? payload.get("paymentMethod")
                            : "ONLINE_CARD";

            Fine fine =
                    fineService.payFine(
                            id,
                            paymentMethod
                    );

            return ResponseEntity.ok(fine);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            e.getMessage()
                    ));
        }
    }


    // =========================
    // DELETE - Cancel fine
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFine(
            @PathVariable Long id) {

        try {

            fineService.deleteFine(id);

            return ResponseEntity.ok(
                    Collections.singletonMap(
                            "message",
                            "Fine cancelled successfully"
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            e.getMessage()
                    ));
        }
    }
}
