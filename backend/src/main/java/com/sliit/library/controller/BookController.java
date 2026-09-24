package com.sliit.library.controller;

import com.sliit.library.model.Book;
import com.sliit.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookService bookService;

    // GET all books / search books
    @GetMapping
    public ResponseEntity<List<Book>> getBooks(
            @RequestParam(required = false) String search) {

        return ResponseEntity.ok(bookService.searchBooks(search));
    }

    // GET book by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(@PathVariable Long id) {

        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE book
    @PostMapping
    public ResponseEntity<?> addBook(@RequestBody Book book) {

        try {
            return ResponseEntity.ok(bookService.addBook(book));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // UPDATE book
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(
            @PathVariable Long id,
            @RequestBody Book book) {

        try {
            return ResponseEntity.ok(
                    bookService.updateBook(id, book)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE / Archive book
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {

        try {
            bookService.deleteBook(id);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Book archived successfully"
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}