package com.sliit.library.controller;

import com.sliit.library.model.BookReview;
import com.sliit.library.service.BookReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class BookReviewController {

    @Autowired
    private BookReviewService reviewService;

    @GetMapping("/book/{bookId}")
    public ResponseEntity<?> getReviews(@PathVariable Long bookId) {
        try {
            return ResponseEntity.ok(reviewService.getReviewsForBook(bookId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> payload) {
        try {
            if (payload == null || payload.get("memberId") == null || payload.get("bookId") == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "memberId and bookId are required"));
            }

            Long memberId = Long.valueOf(payload.get("memberId").toString());
            Long bookId = Long.valueOf(payload.get("bookId").toString());
            int rating = Integer.parseInt(payload.getOrDefault("rating", 0).toString());
            String comment = payload.get("comment") == null ? "" : payload.get("comment").toString();

            return ResponseEntity.ok(
                    reviewService.addOrUpdateReview(memberId, bookId, rating, comment)
            );
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
