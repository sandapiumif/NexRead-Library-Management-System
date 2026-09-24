package com.sliit.library.service;

import com.sliit.library.model.Book;
import com.sliit.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepo;

    // =========================================================
    // GET ALL ACTIVE BOOKS
    // =========================================================

    public List<Book> getAllBooks() {
        return bookRepo.findActiveCatalogBooks();
    }

    // =========================================================
    // SEARCH ACTIVE BOOKS
    // =========================================================

    public List<Book> searchBooks(String query) {

        if (query == null || query.trim().isEmpty()) {
            return getAllBooks();
        }

        return bookRepo.searchBooks(query.trim());
    }

    // =========================================================
    // GET BOOK BY ID
    // =========================================================

    public Optional<Book> getBookById(Long id) {
        return bookRepo.findById(id);
    }

    // =========================================================
    // ADD NEW BOOK
    // =========================================================

    public Book addBook(Book book) {

        validateBookFields(book);

        String normalizedIsbn =
                normalizeIsbn(book.getIsbn());

        validateIsbn(normalizedIsbn);

        if (bookRepo.findByIsbn(normalizedIsbn).isPresent()) {
            throw new IllegalArgumentException(
                    "A book with this ISBN already exists"
            );
        }

        long count = bookRepo.count() + 2001;

        book.setBookCode("BK-" + count);

        book.setIsbn(normalizedIsbn);

        if (book.getTotalCopies() <= 0) {
            throw new IllegalArgumentException(
                    "Total copies must be greater than 0"
            );
        }

        book.setAvailableCopies(
                book.getTotalCopies()
        );

        book.setStatus("AVAILABLE");

        book.setTitle(
                book.getTitle().trim()
        );

        book.setAuthor(
                book.getAuthor().trim()
        );

        book.setPublisher(
                book.getPublisher().trim()
        );

        book.setCategory(
                book.getCategory().trim()
        );

        if (book.getDescription() != null) {
            book.setDescription(
                    book.getDescription().trim()
            );
        }

        if (
                book.getCoverImage() == null ||
                        book.getCoverImage().trim().isEmpty()
        ) {

            book.setCoverImage(
                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80"
            );

        } else {

            book.setCoverImage(
                    book.getCoverImage().trim()
            );
        }

        return bookRepo.save(book);
    }

    // =========================================================
    // UPDATE BOOK
    // =========================================================

    public Book updateBook(
            Long id,
            Book updatedBook
    ) {

        Book book = bookRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Book not found"
                        )
                );

        validateBookFields(updatedBook);

        String normalizedIsbn =
                normalizeIsbn(
                        updatedBook.getIsbn()
                );

        validateIsbn(normalizedIsbn);

        Optional<Book> existingBook =
                bookRepo.findByIsbn(normalizedIsbn);

        if (
                existingBook.isPresent() &&
                        !existingBook.get()
                                .getId()
                                .equals(id)
        ) {

            throw new IllegalArgumentException(
                    "A book with this ISBN already exists"
            );
        }

        int borrowedCopies =
                book.getTotalCopies()
                        - book.getAvailableCopies();

        if (updatedBook.getTotalCopies() <= 0) {

            throw new IllegalArgumentException(
                    "Total copies must be greater than 0"
            );
        }

        if (
                updatedBook.getTotalCopies()
                        < borrowedCopies
        ) {

            throw new IllegalArgumentException(
                    "Total copies cannot be less than currently borrowed copies"
            );
        }

        book.setTitle(
                updatedBook.getTitle().trim()
        );

        book.setAuthor(
                updatedBook.getAuthor().trim()
        );

        book.setIsbn(
                normalizedIsbn
        );

        book.setPublisher(
                updatedBook.getPublisher().trim()
        );

        book.setCategory(
                updatedBook.getCategory().trim()
        );

        book.setDescription(
                updatedBook.getDescription() == null
                        ? null
                        : updatedBook.getDescription().trim()
        );

        book.setCoverImage(
                updatedBook.getCoverImage() == null
                        ? null
                        : updatedBook.getCoverImage().trim()
        );

        book.setTotalCopies(
                updatedBook.getTotalCopies()
        );

        book.setAvailableCopies(
                updatedBook.getTotalCopies()
                        - borrowedCopies
        );

        book.setStatus(
                book.getAvailableCopies() > 0
                        ? "AVAILABLE"
                        : "BORROWED"
        );

        return bookRepo.save(book);
    }

    // =========================================================
    // ARCHIVE BOOK
    // =========================================================

    public void deleteBook(Long id) {

        Book book = bookRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Book not found"
                        )
                );

        if (
                "ARCHIVED".equalsIgnoreCase(
                        book.getStatus()
                )
        ) {

            throw new IllegalArgumentException(
                    "Book is already archived"
            );
        }

        int borrowedCopies =
                book.getTotalCopies()
                        - book.getAvailableCopies();

        if (borrowedCopies > 0) {

            throw new IllegalArgumentException(
                    "A book with active borrowed copies cannot be archived"
            );
        }

        book.setStatus("ARCHIVED");

        bookRepo.save(book);
    }

    // =========================================================
    // GET ARCHIVED BOOKS
    // =========================================================

    public List<Book> getArchivedBooks() {

        return bookRepo.findArchivedBooks();
    }

    // =========================================================
    // RESTORE ARCHIVED BOOK
    // =========================================================

    public Book restoreBook(Long id) {

        Book book = bookRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Book not found"
                        )
                );

        if (
                !"ARCHIVED".equalsIgnoreCase(
                        book.getStatus()
                )
        ) {

            throw new IllegalArgumentException(
                    "Book is not archived"
            );
        }

        if (book.getAvailableCopies() > 0) {

            book.setStatus("AVAILABLE");

        } else {

            book.setStatus("BORROWED");
        }

        return bookRepo.save(book);
    }

    // =========================================================
    // VALIDATION
    // =========================================================

    private void validateBookFields(Book book) {

        if (book == null) {

            throw new IllegalArgumentException(
                    "Book data is required"
            );
        }

        requireText(
                book.getTitle(),
                "Book title is required"
        );

        requireText(
                book.getAuthor(),
                "Author is required"
        );

        requireText(
                book.getPublisher(),
                "Publisher is required"
        );

        requireText(
                book.getCategory(),
                "Category is required"
        );

        requireText(
                book.getIsbn(),
                "ISBN is required"
        );
    }

    private void requireText(
            String value,
            String message
    ) {

        if (
                value == null ||
                        value.trim().isEmpty()
        ) {

            throw new IllegalArgumentException(
                    message
            );
        }
    }

    // =========================================================
    // ISBN NORMALIZATION
    // =========================================================

    private String normalizeIsbn(String isbn) {

        return isbn == null
                ? ""
                : isbn
                .replaceAll("[-\\s]", "")
                .trim()
                .toUpperCase();
    }

    // =========================================================
    // ISBN VALIDATION
    // =========================================================

    private void validateIsbn(String isbn) {

        // ISBN-13
        if (isbn.matches("\\d{13}")) {

            int sum = 0;

            for (int i = 0; i < 13; i++) {

                int digit =
                        isbn.charAt(i) - '0';

                sum +=
                        (i % 2 == 0)
                                ? digit
                                : digit * 3;
            }

            if (sum % 10 != 0) {

                throw new IllegalArgumentException(
                        "Invalid ISBN-13"
                );
            }

            return;
        }

        // ISBN-10
        if (isbn.matches("\\d{9}[0-9X]")) {

            int sum = 0;

            for (int i = 0; i < 10; i++) {

                int digit =
                        isbn.charAt(i) == 'X'
                                ? 10
                                : isbn.charAt(i) - '0';

                sum +=
                        digit * (10 - i);
            }

            if (sum % 11 != 0) {

                throw new IllegalArgumentException(
                        "Invalid ISBN-10"
                );
            }

            return;
        }

        throw new IllegalArgumentException(
                "ISBN must be a valid ISBN-10 or ISBN-13"
        );
    }
}