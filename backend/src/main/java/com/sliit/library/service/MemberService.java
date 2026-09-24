package com.sliit.library.service;

import com.sliit.library.model.Member;
import com.sliit.library.repository.MemberRepository;
import com.sliit.library.repository.RenewalHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sliit.library.model.RenewalHistory;
import com.sliit.library.model.MembershipTypeChangeRequest;
import com.sliit.library.repository.MembershipTypeChangeRequestRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private RenewalHistoryRepository renewalHistoryRepo;

    @Autowired
    private MembershipTypeChangeRequestRepository membershipTypeChangeRequestRepository;

    // Get all members
    public List<Member> getAllMembers() {
        return memberRepo.findAll();
    }

    // Get member by ID
    public Optional<Member> getMemberById(Long id) {
        return memberRepo.findById(id);
    }

    // Save member
    public Member saveMember(Member member) {
        return memberRepo.save(member);
    }

    // Register new member
    public Member registerMember(Member member) {

        if (member.getFullName() == null ||
                member.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Full name is required");
        }

        if (member.getEmail() == null ||
                member.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email address is required");
        }

        if (member.getPhone() == null ||
                member.getPhone().trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required");
        }

        if (member.getAddress() == null ||
                member.getAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Address is required");
        }

        if (member.getIdNumber() == null ||
                member.getIdNumber().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "National ID / Passport number is required");
        }

        if (memberRepo.findByEmail(member.getEmail().trim()).isPresent()) {
            throw new IllegalArgumentException(
                    "A member with this email already exists");
        }

        if (memberRepo.findByIdNumber(member.getIdNumber().trim()).isPresent()) {
            throw new IllegalArgumentException(
                    "A member with this ID / Passport number already exists");
        }

        long count = memberRepo.count() + 1001;
        member.setMemberCode("MEM-" + count);

        if (member.getMembershipType() == null ||
                member.getMembershipType().trim().isEmpty()) {
            member.setMembershipType("STUDENT");
        }

        // New member starts as pending
        member.setStatus("PENDING");

        // Document verification starts as pending
        member.setVerificationStatus("PENDING");

        member.setJoinDate(LocalDate.now());
        member.setExpiryDate(LocalDate.now().plusYears(1));

        if ("FACULTY".equalsIgnoreCase(member.getMembershipType())) {
            member.setMaxBorrowLimit(6);
        } else {
            member.setMaxBorrowLimit(3);
        }

        return memberRepo.save(member);
    }

    // Update member status
    public Member updateMemberStatus(Long id, String status) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        member.setStatus(status.toUpperCase());

        return memberRepo.save(member);
    }

    // Approve pending member
    public Member approveMember(Long id) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        if (!"PENDING".equalsIgnoreCase(member.getStatus())) {
            throw new IllegalArgumentException(
                    "Only pending members can be approved");
        }

        // Verification must be completed before approval
        if (!"VERIFIED".equalsIgnoreCase(
                member.getVerificationStatus())) {

            throw new IllegalArgumentException(
                    "Membership cannot be approved until the verification document is verified");
        }

        member.setStatus("ACTIVE");

        return memberRepo.save(member);
    }

    // Reject pending member
    public Member rejectMember(Long id) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        if (!"PENDING".equalsIgnoreCase(member.getStatus())) {
            throw new IllegalArgumentException(
                    "Only pending members can be rejected");
        }

        member.setStatus("REJECTED");

        return memberRepo.save(member);
    }

    // Update member details
    public Member updateMember(Long id, Member updatedMember) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        if (updatedMember.getFullName() == null ||
                updatedMember.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Full name is required");
        }

        if (updatedMember.getEmail() == null ||
                updatedMember.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email address is required");
        }

        Optional<Member> existingMember =
                memberRepo.findByEmail(updatedMember.getEmail().trim());

        if (existingMember.isPresent() &&
                !existingMember.get().getId().equals(id)) {
            throw new IllegalArgumentException(
                    "A member with this email already exists");
        }

        member.setFullName(updatedMember.getFullName().trim());
        member.setEmail(updatedMember.getEmail().trim());
        member.setPhone(updatedMember.getPhone());
        member.setAddress(updatedMember.getAddress());
        member.setIdNumber(updatedMember.getIdNumber());

        return memberRepo.save(member);
    }

    // Delete / deactivate member
    public void deleteMember(Long id) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        if ("INACTIVE".equalsIgnoreCase(member.getStatus())) {
            throw new IllegalArgumentException(
                    "Member is already inactive");
        }

        member.setStatus("INACTIVE");

        memberRepo.save(member);
    }

    // =========================================================
// MEMBERSHIP RENEWAL
// =========================================================

    public Member renewMembership(Long id) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        if (member.getExpiryDate() == null) {
            throw new IllegalArgumentException(
                    "Membership expiry date is not available");
        }

        LocalDate today = LocalDate.now();

        // Membership must be expired before renewal
        if (!member.getExpiryDate().isBefore(today)) {
            throw new IllegalArgumentException(
                    "Membership has not expired yet");
        }

        // Store previous expiry date before updating
        LocalDate previousExpiryDate = member.getExpiryDate();

        // Renew for 12 months
        LocalDate newExpiryDate = today.plusMonths(12);

        member.setExpiryDate(newExpiryDate);

        // Renewed member becomes active again
        member.setStatus("ACTIVE");

        // Save renewal history
        RenewalHistory history = new RenewalHistory();

        history.setMemberId(member.getId());
        history.setPreviousExpiryDate(previousExpiryDate);
        history.setNewExpiryDate(newExpiryDate);
        history.setRenewalDate(today);

        renewalHistoryRepo.save(history);

        return memberRepo.save(member);
    }
    // =========================================================
    // DOCUMENT VERIFICATION
    // =========================================================

    public Member updateVerificationStatus(
            Long id,
            String verificationStatus) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        if (member.getVerificationDocument() == null ||
                member.getVerificationDocument().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "No verification document has been uploaded");
        }

        String newStatus = verificationStatus.trim().toUpperCase();

        if (!newStatus.equals("VERIFIED") &&
                !newStatus.equals("REJECTED") &&
                !newStatus.equals("PENDING")) {

            throw new IllegalArgumentException(
                    "Invalid verification status");
        }

        member.setVerificationStatus(newStatus);

        return memberRepo.save(member);
    }

    // =========================================================
// REQUEST MEMBERSHIP TYPE CHANGE
// =========================================================

    public MembershipTypeChangeRequest requestMembershipTypeChange(
            Long memberId,
            String requestedMembershipType,
            String reason) {

        // Find member
        Member member = memberRepo.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Member not found."
                        )
                );

        // Only active members can request a membership type change
        if (!"ACTIVE".equalsIgnoreCase(member.getStatus())) {
            throw new IllegalArgumentException(
                    "Only active members can request a membership type change."
            );
        }

        // Validate requested type
        if (requestedMembershipType == null ||
                requestedMembershipType.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Membership type is required."
            );
        }

        requestedMembershipType =
                requestedMembershipType.trim().toUpperCase();

        // Allowed membership types
        if (!requestedMembershipType.equals("STUDENT") &&
                !requestedMembershipType.equals("FACULTY") &&
                !requestedMembershipType.equals("GENERAL")) {

            throw new IllegalArgumentException(
                    "Invalid membership type."
            );
        }

        // Cannot request the same membership type
        if (requestedMembershipType.equalsIgnoreCase(
                member.getMembershipType())) {

            throw new IllegalArgumentException(
                    "You are already a member of this membership type."
            );
        }

        // Check existing pending request
        List<MembershipTypeChangeRequest> existingRequests =
                membershipTypeChangeRequestRepository
                        .findByMemberIdOrderByRequestedAtDesc(memberId);

        boolean hasPendingRequest =
                existingRequests.stream()
                        .anyMatch(request ->
                                "PENDING".equalsIgnoreCase(
                                        request.getStatus()
                                )
                        );

        if (hasPendingRequest) {
            throw new IllegalArgumentException(
                    "You already have a pending membership type change request."
            );
        }

        // Create request
        MembershipTypeChangeRequest request =
                new MembershipTypeChangeRequest();

        request.setMemberId(memberId);

        request.setCurrentMembershipType(
                member.getMembershipType()
        );

        request.setRequestedMembershipType(
                requestedMembershipType
        );

        request.setReason(
                reason == null ? "" : reason.trim()
        );

        request.setStatus("PENDING");

        request.setRequestedAt(
                java.time.LocalDateTime.now()
        );

        return membershipTypeChangeRequestRepository.save(request);
    }

    // =========================================================
// APPROVE MEMBERSHIP TYPE CHANGE
// =========================================================

    public Member approveMembershipTypeChange(Long requestId) {

        MembershipTypeChangeRequest request =
                membershipTypeChangeRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Membership type change request not found"
                                )
                        );

        // Request must be pending
        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalArgumentException(
                    "Only pending membership type change requests can be approved"
            );
        }

        // Find member
        Member member = memberRepo.findById(request.getMemberId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Member not found"
                        )
                );

        // Make sure current membership type has not changed
        if (!request.getCurrentMembershipType()
                .equalsIgnoreCase(member.getMembershipType())) {

            throw new IllegalArgumentException(
                    "The member's current membership type has changed since this request was submitted"
            );
        }

        String newMembershipType =
                request.getRequestedMembershipType()
                        .trim()
                        .toUpperCase();

        // Determine borrow limit according to membership type
        int newBorrowLimit;

        switch (newMembershipType) {

            case "STUDENT":
                newBorrowLimit = 3;
                break;

            case "FACULTY":
                newBorrowLimit = 6;
                break;

            case "GENERAL":
                newBorrowLimit = 2;
                break;

            default:
                throw new IllegalArgumentException(
                        "Invalid requested membership type"
                );
        }

        // Update member
        member.setMembershipType(newMembershipType);
        member.setMaxBorrowLimit(newBorrowLimit);

        // Update request
        request.setStatus("APPROVED");
        request.setProcessedAt(
                java.time.LocalDateTime.now()
        );

        membershipTypeChangeRequestRepository.save(request);

        return memberRepo.save(member);
    }

    // =========================================================
// REJECT MEMBERSHIP TYPE CHANGE
// =========================================================

    public MembershipTypeChangeRequest rejectMembershipTypeChange(
            Long requestId) {

        MembershipTypeChangeRequest request =
                membershipTypeChangeRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Membership type change request not found"
                                )
                        );

        // Request must be pending
        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalArgumentException(
                    "Only pending membership type change requests can be rejected"
            );
        }

        request.setStatus("REJECTED");

        request.setProcessedAt(
                java.time.LocalDateTime.now()
        );

        return membershipTypeChangeRequestRepository.save(request);
    }
}