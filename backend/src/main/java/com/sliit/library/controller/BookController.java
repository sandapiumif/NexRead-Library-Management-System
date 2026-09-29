package com.sliit.library.controller;

import com.sliit.library.model.Book;
import com.sliit.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    // GET archived books
    @GetMapping("/archived")
    public ResponseEntity<List<Book>> getArchivedBooks() {

        return ResponseEntity.ok(
                bookService.getArchivedBooks()
        );
    }

    // RESTORE archived book
    @PutMapping("/{id}/restore")
    public ResponseEntity<?> restoreBook(@PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    bookService.restoreBook(id)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    @PostMapping(
            value = "/{id}/cover-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadCoverImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        try {
            return ResponseEntity.ok(
                    bookService.uploadCoverImage(id, file)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to upload book cover"));
        }
    }

    @GetMapping("/{id}/cover-image/{fileName}")
    public ResponseEntity<?> getCoverImage(
            @PathVariable Long id,
            @PathVariable String fileName) {

        try {
            Path filePath = Paths.get("uploads/book-covers").resolve(fileName);

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);

            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(Files.readAllBytes(filePath));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}