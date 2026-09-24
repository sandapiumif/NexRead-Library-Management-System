package com.sliit.library.controller;

import com.sliit.library.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wishlists")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/member/{memberId}")
    public ResponseEntity<?> getWishlist(@PathVariable Long memberId) {
        try {
            return ResponseEntity.ok(wishlistService.getWishlist(memberId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/member/{memberId}/book/{bookId}/exists")
    public ResponseEntity<?> exists(@PathVariable Long memberId, @PathVariable Long bookId) {
        return ResponseEntity.ok(Map.of("inWishlist", wishlistService.isInWishlist(memberId, bookId)));
    }

    @PostMapping("/member/{memberId}/book/{bookId}")
    public ResponseEntity<?> add(@PathVariable Long memberId, @PathVariable Long bookId) {
        try {
            return ResponseEntity.ok(wishlistService.addToWishlist(memberId, bookId));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/member/{memberId}/book/{bookId}")
    public ResponseEntity<?> remove(@PathVariable Long memberId, @PathVariable Long bookId) {
        try {
            wishlistService.removeFromWishlist(memberId, bookId);
            return ResponseEntity.ok(Map.of("message", "Book removed from wishlist"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
