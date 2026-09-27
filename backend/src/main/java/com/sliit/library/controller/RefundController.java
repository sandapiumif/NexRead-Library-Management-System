package com.sliit.library.controller;

import com.sliit.library.model.Refund;
import com.sliit.library.service.RefundService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/refunds")
@CrossOrigin(origins = "*")
public class RefundController {

    private final RefundService refundService;

    public RefundController(RefundService refundService) {
        this.refundService = refundService;
    }

    // Get all refunds
    @GetMapping
    public ResponseEntity<List<Refund>> getAllRefunds() {
        return ResponseEntity.ok(
                refundService.getAllRefunds()
        );
    }

    // Get refunds by member
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Refund>> getRefundsByMember(
            @PathVariable Long memberId
    ) {
        return ResponseEntity.ok(
                refundService.getRefundsByMember(memberId)
        );
    }

    // Get refund for a specific fine
    @GetMapping("/fine/{fineId}")
    public ResponseEntity<?> getRefundByFineId(
            @PathVariable Long fineId
    ) {
        Refund refund = refundService.getRefundByFineId(fineId);

        if (refund == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(refund);
    }

    // Process refund
    @PostMapping("/process/{fineId}")
    public ResponseEntity<?> processRefund(
            @PathVariable Long fineId,
            @RequestBody RefundRequest request
    ) {
        try {

            if (request == null ||
                    request.reason == null ||
                    request.reason.trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(Collections.singletonMap(
                                "error",
                                "Refund reason is required"
                        ));
            }

            Refund refund = refundService.processRefund(
                    fineId,
                    request.reason
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(refund);

        } catch (IllegalArgumentException | IllegalStateException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            ex.getMessage()
                    ));
        }
    }

    // Request body for refund processing
    public static class RefundRequest {

        public String reason;

        public RefundRequest() {
        }
    }
}