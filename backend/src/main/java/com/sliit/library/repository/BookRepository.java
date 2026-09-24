package com.sliit.library.repository;

import com.sliit.library.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Data access operations for book collection
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByBookCode(String bookCode);
    Optional<Book> findByIsbn(String isbn);
    List<Book> findByCategoryIgnoreCase(String category);

    // search books by title, author, or isbn
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Book> searchBooks(@Param("query") String query);
}
