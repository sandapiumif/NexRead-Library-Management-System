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

    // Get only active / non-archived books
    @Query("""
        SELECT b FROM Book b
        WHERE UPPER(b.status) <> 'ARCHIVED'
        """)
    List<Book> findActiveCatalogBooks();

    // Search only active / non-archived books
    @Query("""
        SELECT b FROM Book b
        WHERE UPPER(b.status) <> 'ARCHIVED'
          AND (
              LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(b.bookCode) LIKE LOWER(CONCAT('%', :search, '%'))
          )
        """)
    List<Book> searchBooks(@Param("search") String search);

    // Get archived books
    @Query("""
        SELECT b FROM Book b
        WHERE UPPER(b.status) = 'ARCHIVED'
        """)
    List<Book> findArchivedBooks();
}