package com.sliit.library.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Member entity for registration and lifecycle management (UC 01)
@Entity
@Table(name = "Members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_code", unique = true, nullable = false)
    private String memberCode;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String address;

    @Column(name = "id_number", nullable = false)
    private String idNumber;

    @Column(name = "membership_type")
    private String membershipType; // STUDENT, FACULTY, GENERAL

    @Column(nullable = false)
    private String status; // ACTIVE, PENDING, SUSPENDED, EXPIRED

    @Column(name = "max_borrow_limit")
    private int maxBorrowLimit = 3;

    @Column(name = "join_date")
    private LocalDate joinDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "profile_image")
    private String profileImage;

    // Identity / Document Verification
    @Column(name = "verification_document")
    private String verificationDocument;

    @Column(name = "verification_document_name")
    private String verificationDocumentName;

    @Column(name = "verification_status")
    private String verificationStatus; // PENDING, VERIFIED, REJECTED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Member() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMemberCode() { return memberCode; }
    public void setMemberCode(String memberCode) { this.memberCode = memberCode; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

    public String getMembershipType() { return membershipType; }
    public void setMembershipType(String membershipType) { this.membershipType = membershipType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getMaxBorrowLimit() { return maxBorrowLimit; }
    public void setMaxBorrowLimit(int maxBorrowLimit) { this.maxBorrowLimit = maxBorrowLimit; }

    public LocalDate getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDate joinDate) { this.joinDate = joinDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public String getProfileImage() { return profileImage;}
    public void setProfileImage(String profileImage) { this.profileImage = profileImage;}

    // Verification Document
    public String getVerificationDocument() { return verificationDocument;}
    public void setVerificationDocument(String verificationDocument) {this.verificationDocument = verificationDocument; }

    public String getVerificationDocumentName() { return verificationDocumentName; }
    public void setVerificationDocumentName(String verificationDocumentName) { this.verificationDocumentName = verificationDocumentName; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
