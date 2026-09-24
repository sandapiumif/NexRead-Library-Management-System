package com.sliit.library.controller;

import com.sliit.library.model.BookRequest;
import com.sliit.library.service.BookRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class BookRequestController {

    @Autowired
    private BookRequestService bookRequestService;


    // ==============================
    // READ - Get all book requests
    // ==============================
    @GetMapping
    public ResponseEntity<List<BookRequest>> getAllBookRequests() {
        return ResponseEntity.ok(
                bookRequestService.getAllBookRequests()
        );
    }


    // ==============================
    // CREATE - Submit book request
    // ==============================
    @PostMapping
    public ResponseEntity<?> submitBookRequest(
            @RequestBody Map<String, Object> payload) {

        try {

            if (payload == null ||
                    payload.get("memberId") == null) {

                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap(
                                "error",
                                "Member ID is required"
                        ));
            }

            Long memberId =
                    Long.valueOf(
                            payload.get("memberId").toString()
                    );

            BookRequest request = new BookRequest();

            request.setTitle(
                    (String) payload.get("title")
            );

            request.setAuthor(
                    (String) payload.get("author")
            );

            request.setIsbn(
                    (String) payload.get("isbn")
            );

            request.setPublisher(
                    (String) payload.get("publisher")
            );

            request.setReason(
                    (String) payload.get("reason")
            );

            BookRequest created =
                    bookRequestService.submitBookRequest(
                            memberId,
                            request
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(created);

        } catch (IllegalArgumentException |
                 IllegalStateException ex) {

            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            ex.getMessage()
                    ));
        }
    }


    // ==============================
    // UPDATE - Update request status
    // ==============================
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {

        try {

            String status = payload.get("status");
            String notes = payload.get("adminNotes");

            BookRequest updated =
                    bookRequestService.updateRequestStatus(
                            id,
                            status,
                            notes
                    );

            return ResponseEntity.ok(updated);

        } catch (IllegalArgumentException ex) {

            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            ex.getMessage()
                    ));
        }
    }


    // ==============================
    // DELETE - Cancel book request
    // ==============================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBookRequest(
            @PathVariable Long id) {

        try {

            bookRequestService.deleteBookRequest(id);

            return ResponseEntity.ok(
                    Collections.singletonMap(
                            "message",
                            "Book request cancelled successfully"
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException ex) {

            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap(
                            "error",
                            ex.getMessage()
                    ));
        }
    }
}