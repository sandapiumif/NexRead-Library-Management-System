package com.sliit.library.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "membership_type_change_requests")
public class MembershipTypeChangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long memberId;

    private String currentMembershipType;

    private String requestedMembershipType;

    @Column(length = 500)
    private String reason;

    private String status;

    private LocalDateTime requestedAt;

    private LocalDateTime processedAt;


    // ==============================
    // CONSTRUCTORS
    // ==============================

    public MembershipTypeChangeRequest() {
    }


    // ==============================
    // GETTERS & SETTERS
    // ==============================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }


    public String getCurrentMembershipType() {
        return currentMembershipType;
    }

    public void setCurrentMembershipType(String currentMembershipType) {
        this.currentMembershipType = currentMembershipType;
    }


    public String getRequestedMembershipType() {
        return requestedMembershipType;
    }

    public void setRequestedMembershipType(String requestedMembershipType) {
        this.requestedMembershipType = requestedMembershipType;
    }


    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }


    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
}
