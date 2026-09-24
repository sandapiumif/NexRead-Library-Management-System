package com.sliit.library.controller;

import com.sliit.library.model.Book;
import com.sliit.library.service.BookRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class BookRecommendationController {

    @Autowired
    private BookRecommendationService recommendationService;

    @GetMapping("/member/{memberId}")
    public ResponseEntity<?> getRecommendations(@PathVariable Long memberId) {
        try {
            List<Book> books = recommendationService.getRecommendations(memberId);
            return ResponseEntity.ok(books);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
