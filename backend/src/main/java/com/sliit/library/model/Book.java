package com.sliit.library.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// Book entity for catalog and collection management (UC 02.1)
@Entity
@Table(name = "Books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "book_code", unique = true, nullable = false)
    private String bookCode;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(unique = true, nullable = false)
    private String isbn;

    @Column(nullable = false)
    private String publisher;

    @Column(nullable = false)
    private String category;

    @Column(name = "total_copies", nullable = false)
    private int totalCopies = 1;

    @Column(name = "available_copies", nullable = false)
    private int availableCopies = 1;

    @Column(nullable = false)
    private String status; // AVAILABLE, BORROWED, RESERVED, MAINTENANCE

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Book() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookCode() { return bookCode; }
    public void setBookCode(String bookCode) { this.bookCode = bookCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getTotalCopies() { return totalCopies; }
    public void setTotalCopies(int totalCopies) { this.totalCopies = totalCopies; }

    public int getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(int availableCopies) { this.availableCopies = availableCopies; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
