package com.sliit.library.controller;

import com.sliit.library.model.BorrowingRequest;
import com.sliit.library.service.BorrowingRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrowing-requests")
@CrossOrigin(origins = "*")
public class BorrowingRequestController {

    @Autowired
    private BorrowingRequestService requestService;


    // =========================================================
    // GET ALL BORROWING REQUESTS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<BorrowingRequest>> getAll() {

        return ResponseEntity.ok(
                requestService.getAllRequests()
        );
    }


    // =========================================================
    // GET MEMBER BORROWING REQUESTS
    // =========================================================

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<BorrowingRequest>> getByMember(
            @PathVariable Long memberId
    ) {

        return ResponseEntity.ok(
                requestService.getRequestsByMember(memberId)
        );
    }


    // =========================================================
    // GET BORROWING REQUEST BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @PathVariable Long id
    ) {

        return requestService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // =========================================================
    // CREATE BORROWING REQUEST
    // =========================================================

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody Map<String, Object> payload
    ) {

        try {

            if (
                    payload == null ||
                            payload.get("memberId") == null ||
                            payload.get("bookId") == null
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "memberId and bookId are required"
                                )
                        );
            }


            Long memberId =
                    Long.valueOf(
                            payload.get("memberId").toString()
                    );


            Long bookId =
                    Long.valueOf(
                            payload.get("bookId").toString()
                    );


            String notes =
                    payload.get("notes") == null
                            ? ""
                            : payload.get("notes").toString();


            return ResponseEntity.ok(
                    requestService.createRequest(
                            memberId,
                            bookId,
                            notes
                    )
            );

        } catch (
                IllegalArgumentException |
                IllegalStateException e
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // APPROVE BORROWING REQUEST
    // =========================================================

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(
            @PathVariable Long id
    ) {

        try {

            return ResponseEntity.ok(
                    requestService.approveRequest(id)
            );

        } catch (
                IllegalArgumentException |
                IllegalStateException e
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // REJECT BORROWING REQUEST
    // =========================================================

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(
            @PathVariable Long id,
            @RequestBody(required = false)
            Map<String, Object> payload
    ) {

        try {

            String reason =
                    payload == null ||
                            payload.get("reason") == null
                            ? ""
                            : payload.get("reason")
                            .toString();


            return ResponseEntity.ok(
                    requestService.rejectRequest(
                            id,
                            reason
                    )
            );

        } catch (
                IllegalArgumentException |
                IllegalStateException e
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =========================================================
    // CANCEL BORROWING REQUEST
    // =========================================================

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload
    ) {

        try {

            if (
                    payload == null ||
                            payload.get("memberId") == null
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "memberId is required"
                                )
                        );
            }


            Long memberId =
                    Long.valueOf(
                            payload.get("memberId").toString()
                    );


            return ResponseEntity.ok(
                    requestService.cancelRequest(
                            id,
                            memberId
                    )
            );

        } catch (
                IllegalArgumentException |
                IllegalStateException e
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    e.getMessage()
                            )
                    );
        }
    }
}