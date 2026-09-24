package com.sliit.library.controller;

import com.sliit.library.model.BorrowingRecord;
import com.sliit.library.service.BorrowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrowings")
@CrossOrigin(origins = "*")
public class BorrowingController {

    @Autowired
    private BorrowingService borrowingService;

    // READ - Get all borrowing records
    @GetMapping
    public ResponseEntity<List<BorrowingRecord>> getAllBorrowings() {
        return ResponseEntity.ok(
                borrowingService.getAllBorrowings()
        );
    }

    // READ - Get borrowing record by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBorrowingById(
            @PathVariable Long id) {

        return borrowingService.getBorrowingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE - Issue a book
    @PostMapping("/issue")
    public ResponseEntity<?> issueBook(
            @RequestBody Map<String, Object> payload) {

        try {
            if (payload == null ||
                    payload.get("memberId") == null ||
                    payload.get("bookId") == null) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "memberId and bookId are required"
                        ));
            }

            Long memberId =
                    Long.valueOf(
                            payload.get("memberId").toString()
                    );

            Long bookId =
                    Long.valueOf(
                            payload.get("bookId").toString()
                    );

            BorrowingRecord record =
                    borrowingService.borrowBook(
                            memberId,
                            bookId
                    );

            return ResponseEntity.ok(record);

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    // UPDATE - Update due date / notes
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBorrowing(
            @PathVariable Long id,
            @RequestBody BorrowingRecord borrowingRecord) {

        try {
            return ResponseEntity.ok(
                    borrowingService.updateBorrowing(
                            id,
                            borrowingRecord
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    // UPDATE - Return book
    @PostMapping("/{id}/return")
    public ResponseEntity<?> returnBook(
            @PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    borrowingService.returnBook(id)
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    // DELETE - Cancel borrowing
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBorrowing(
            @PathVariable Long id) {

        try {
            borrowingService.deleteBorrowing(id);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Borrowing cancelled successfully"
                    )
            );

        } catch (IllegalArgumentException |
                 IllegalStateException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }
}