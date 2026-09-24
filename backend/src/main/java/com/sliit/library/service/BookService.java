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

    // Get all books
    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    // Search books
    public List<Book> searchBooks(String query) {
        if (query == null || query.trim().isEmpty()) {
            return bookRepo.findAll();
        }

        return bookRepo.searchBooks(query.trim());
    }

    // Get book by ID
    public Optional<Book> getBookById(Long id) {
        return bookRepo.findById(id);
    }

    // Add a new book
    public Book addBook(Book book) {

        if (book.getTitle() == null ||
                book.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Book title is required");
        }

        if (book.getIsbn() == null ||
                book.getIsbn().trim().isEmpty()) {
            throw new IllegalArgumentException("ISBN is required");
        }

        if (bookRepo.findByIsbn(book.getIsbn().trim()).isPresent()) {
            throw new IllegalArgumentException(
                    "A book with this ISBN already exists");
        }

        // Generate book code
        long count = bookRepo.count() + 2001;
        book.setBookCode("BK-" + count);

        if (book.getTotalCopies() <= 0) {
            book.setTotalCopies(1);
        }

        book.setAvailableCopies(book.getTotalCopies());
        book.setStatus("AVAILABLE");

        // Default cover image
        if (book.getCoverImage() == null ||
                book.getCoverImage().trim().isEmpty()) {
            book.setCoverImage(
                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80"
            );
        }

        return bookRepo.save(book);
    }

    // Update book
    public Book updateBook(Long id, Book updatedBook) {

        Book book = bookRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Book not found"));

        if (updatedBook.getTitle() == null ||
                updatedBook.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Book title is required");
        }

        if (updatedBook.getIsbn() == null ||
                updatedBook.getIsbn().trim().isEmpty()) {
            throw new IllegalArgumentException("ISBN is required");
        }

        // Check whether ISBN belongs to another book
        Optional<Book> existingBook =
                bookRepo.findByIsbn(updatedBook.getIsbn().trim());

        if (existingBook.isPresent() &&
                !existingBook.get().getId().equals(id)) {
            throw new IllegalArgumentException(
                    "A book with this ISBN already exists");
        }

        book.setTitle(updatedBook.getTitle().trim());
        book.setAuthor(updatedBook.getAuthor());
        book.setIsbn(updatedBook.getIsbn().trim());
        book.setPublisher(updatedBook.getPublisher());
        book.setCategory(updatedBook.getCategory());
        book.setDescription(updatedBook.getDescription());
        book.setCoverImage(updatedBook.getCoverImage());

        // Update total copies safely
        if (updatedBook.getTotalCopies() <= 0) {
            throw new IllegalArgumentException(
                    "Total copies must be greater than 0");
        }

        int borrowedCopies =
                book.getTotalCopies() - book.getAvailableCopies();

        if (updatedBook.getTotalCopies() < borrowedCopies) {
            throw new IllegalArgumentException(
                    "Total copies cannot be less than currently borrowed copies");
        }

        book.setTotalCopies(updatedBook.getTotalCopies());

        book.setAvailableCopies(
                updatedBook.getTotalCopies() - borrowedCopies
        );

        if (book.getAvailableCopies() > 0) {
            book.setStatus("AVAILABLE");
        } else {
            book.setStatus("BORROWED");
        }

        return bookRepo.save(book);
    }

    // Delete / Archive book
    public void deleteBook(Long id) {

        Book book = bookRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Book not found"));

        if ("ARCHIVED".equalsIgnoreCase(book.getStatus())) {
            throw new IllegalArgumentException(
                    "Book is already archived");
        }

        book.setStatus("ARCHIVED");
        bookRepo.save(book);
    }
}