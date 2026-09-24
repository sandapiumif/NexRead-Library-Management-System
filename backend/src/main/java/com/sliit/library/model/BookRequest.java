package com.sliit.library.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// Book Request entity for member acquisitions and requests (UC 06.1)
@Entity
@Table(name = "BookRequests")
public class BookRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_code", unique = true, nullable = false)
    private String requestCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    private String isbn;
    private String publisher;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED, ACQUIRED

    @Column(name = "admin_notes")
    private String adminNotes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public BookRequest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestCode() { return requestCode; }
    public void setRequestCode(String requestCode) { this.requestCode = requestCode; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
