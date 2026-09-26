package com.sliit.library.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * MEMBER = notification belongs to a specific member
     * ADMIN  = notification is for the library administrator
     */
    @Column(nullable = false, length = 20)
    private String recipientType;

    /*
     * Only used when recipientType = MEMBER.
     * ADMIN notifications do not need a member.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    /*
     * Examples:
     * BORROWING_REQUEST
     * BORROWING_APPROVED
     * BORROWING_REJECTED
     * OVERDUE
     * FINE
     * RESERVATION
     * BOOK_REQUEST
     * MEMBERSHIP
     */
    @Column(nullable = false, length = 50)
    private String type;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    /*
     * Used to navigate to the relevant section.
     * Examples:
     * borrowings
     * reservations
     * requests
     * members
     * fines
     */
    @Column(length = 50)
    private String referenceType;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();


    // =========================================================
    // CONSTRUCTORS
    // =========================================================

    public Notification() {
    }


    // =========================================================
    // GETTERS & SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRecipientType() {
        return recipientType;
    }

    public void setRecipientType(String recipientType) {
        this.recipientType = recipientType;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public String getReferenceType() {
        return referenceType;
    }

    public void setReferenceType(String referenceType) {
        this.referenceType = referenceType;
    }

    public Long getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(Long referenceId) {
        this.referenceId = referenceId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
