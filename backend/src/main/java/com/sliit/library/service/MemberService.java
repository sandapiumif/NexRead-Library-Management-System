package com.sliit.library.service;

import com.sliit.library.model.Member;
import com.sliit.library.model.MembershipPayment;
import com.sliit.library.repository.MembershipPaymentRepository;
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
    private MembershipPaymentRepository membershipPaymentRepo;

    @Autowired
    private RenewalHistoryRepository renewalHistoryRepo;

    @Autowired
    private MembershipTypeChangeRequestRepository membershipTypeChangeRequestRepository;

    @Autowired
    private NotificationService notificationService;


    // =========================================================
    // GET ALL MEMBERS
    // =========================================================

    public List<Member> getAllMembers() {
        return memberRepo.findAll();
    }


    // =========================================================
    // GET MEMBER BY ID
    // =========================================================

    public Optional<Member> getMemberById(Long id) {
        return memberRepo.findById(id);
    }


    // =========================================================
    // SAVE MEMBER
    // =========================================================

    public Member saveMember(Member member) {
        return memberRepo.save(member);
    }


    // =========================================================
    // REGISTER NEW MEMBER
    // =========================================================

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
                    "National ID / Passport number is required"
            );
        }

        if (memberRepo.findByEmail(member.getEmail().trim()).isPresent()) {

            throw new IllegalArgumentException(
                    "A member with this email already exists"
            );
        }

        if (memberRepo.findByIdNumber(member.getIdNumber().trim()).isPresent()) {

            throw new IllegalArgumentException(
                    "A member with this ID / Passport number already exists"
            );
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

        Member savedMember = memberRepo.save(member);

        // =====================================================
        // ADMIN NOTIFICATION
        // =====================================================

        notificationService.createAdminNotification(
                "New Membership Application",
                "Member " + savedMember.getFullName()
                        + " has submitted a new membership application.",
                "MEMBERSHIP",
                "MEMBERSHIP",
                savedMember.getId()
        );

        return savedMember;
    }


    // =========================================================
    // UPDATE MEMBER STATUS
    // =========================================================

    public Member updateMemberStatus(Long id, String status) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        String newStatus =
                status == null
                        ? ""
                        : status.trim().toUpperCase();

        if (newStatus.isEmpty()) {

            throw new IllegalArgumentException(
                    "Member status is required"
            );
        }

        member.setStatus(newStatus);

        Member savedMember = memberRepo.save(member);

        // =====================================================
        // MEMBER NOTIFICATION
        // =====================================================

        notificationService.createMemberNotification(
                savedMember,
                "Membership Status Updated",
                "Your membership status has been updated to "
                        + newStatus
                        + ".",
                "MEMBERSHIP",
                "MEMBERSHIP",
                savedMember.getId()
        );

        return savedMember;
    }


    // =========================================================
    // APPROVE PENDING MEMBER
    // =========================================================

    public Member approveMember(Long id) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        if (!"PENDING".equalsIgnoreCase(member.getStatus())) {

            throw new IllegalArgumentException(
                    "Only pending members can be approved"
            );
        }

        // Verification must be completed before approval
        if (!"VERIFIED".equalsIgnoreCase(
                member.getVerificationStatus())) {

            throw new IllegalArgumentException(
                    "Membership cannot be approved until the verification document is verified"
            );
        }

        member.setStatus("ACTIVE");

        Member savedMember = memberRepo.save(member);

        // =====================================================
        // MEMBER NOTIFICATION
        // =====================================================

        notificationService.createMemberNotification(
                savedMember,
                "Membership Approved",
                "Your membership application has been approved. "
                        + "Your account is now active.",
                "MEMBERSHIP_APPROVED",
                "MEMBERSHIP",
                savedMember.getId()
        );

        return savedMember;
    }


    // =========================================================
    // REJECT PENDING MEMBER
    // =========================================================

    public Member rejectMember(Long id) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        if (!"PENDING".equalsIgnoreCase(member.getStatus())) {

            throw new IllegalArgumentException(
                    "Only pending members can be rejected"
            );
        }

        member.setStatus("REJECTED");

        Member savedMember = memberRepo.save(member);

        // =====================================================
        // MEMBER NOTIFICATION
        // =====================================================

        notificationService.createMemberNotification(
                savedMember,
                "Membership Application Rejected",
                "Your membership application has been rejected.",
                "MEMBERSHIP_REJECTED",
                "MEMBERSHIP",
                savedMember.getId()
        );

        return savedMember;
    }


    // =========================================================
    // UPDATE MEMBER DETAILS
    // =========================================================

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

            throw new IllegalArgumentException(
                    "Email address is required"
            );
        }

        Optional<Member> existingMember =
                memberRepo.findByEmail(
                        updatedMember.getEmail().trim()
                );

        if (existingMember.isPresent() &&
                !existingMember.get().getId().equals(id)) {

            throw new IllegalArgumentException(
                    "A member with this email already exists"
            );
        }

        member.setFullName(
                updatedMember.getFullName().trim()
        );

        member.setEmail(
                updatedMember.getEmail().trim()
        );

        member.setPhone(updatedMember.getPhone());
        member.setAddress(updatedMember.getAddress());
        member.setIdNumber(updatedMember.getIdNumber());

        Member savedMember = memberRepo.save(member);

        // =====================================================
        // MEMBER NOTIFICATION
        // =====================================================

        notificationService.createMemberNotification(
                savedMember,
                "Profile Updated",
                "Your member profile has been updated by library staff.",
                "MEMBERSHIP",
                "MEMBERSHIP",
                savedMember.getId()
        );

        return savedMember;
    }


    // =========================================================
    // DELETE / DEACTIVATE MEMBER
    // =========================================================

    public void deleteMember(Long id) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        if ("INACTIVE".equalsIgnoreCase(member.getStatus())) {

            throw new IllegalArgumentException(
                    "Member is already inactive"
            );
        }

        member.setStatus("INACTIVE");

        memberRepo.save(member);

        // =====================================================
        // MEMBER NOTIFICATION
        // =====================================================

        notificationService.createMemberNotification(
                member,
                "Membership Deactivated",
                "Your library membership has been deactivated by library staff.",
                "MEMBERSHIP",
                "MEMBERSHIP",
                member.getId()
        );
    }


    // =========================================================
// MEMBERSHIP RENEWAL
// =========================================================

    public Member renewMembership(Long id) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Member not found"
                        )
                );


        // =====================================================
        // CHECK EXPIRY DATE
        // =====================================================

        if (member.getExpiryDate() == null) {

            throw new IllegalArgumentException(
                    "Membership expiry date is not available"
            );
        }


        LocalDate today = LocalDate.now();


        // Membership must be expired before renewal
        if (!member.getExpiryDate().isBefore(today)) {

            throw new IllegalArgumentException(
                    "Membership has not expired yet"
            );
        }


        // Store previous expiry date
        LocalDate previousExpiryDate =
                member.getExpiryDate();


        // =====================================================
        // CHECK PAID RENEWAL PAYMENT
        // =====================================================

        Optional<MembershipPayment> renewalPayment =
                membershipPaymentRepo
                        .findTopByMemberIdAndPaymentTypeAndStatusOrderByPaidAtDesc(
                                member.getId(),
                                "RENEWAL",
                                "PAID"
                        );


        if (renewalPayment.isEmpty()) {

            throw new IllegalStateException(
                    "Membership renewal payment is required before renewal"
            );
        }


        MembershipPayment payment =
                renewalPayment.get();


        // =====================================================
        // MAKE SURE PAYMENT WAS MADE FOR THIS
        // EXPIRED MEMBERSHIP PERIOD
        // =====================================================

        if (payment.getPaidAt() == null ||
                !payment.getPaidAt()
                        .toLocalDate()
                        .isAfter(previousExpiryDate)) {

            throw new IllegalStateException(
                    "A valid paid renewal payment for the expired membership is required"
            );
        }


        // =====================================================
        // RENEW MEMBERSHIP
        // =====================================================

        LocalDate newExpiryDate =
                today.plusMonths(12);

        member.setExpiryDate(newExpiryDate);

        // Renewed member becomes active again
        member.setStatus("ACTIVE");


        // =====================================================
        // SAVE RENEWAL HISTORY
        // =====================================================

        RenewalHistory history =
                new RenewalHistory();

        history.setMemberId(member.getId());

        history.setPreviousExpiryDate(
                previousExpiryDate
        );

        history.setNewExpiryDate(
                newExpiryDate
        );

        history.setRenewalDate(
                today
        );

        renewalHistoryRepo.save(history);


        // =====================================================
        // SAVE MEMBER
        // =====================================================

        Member savedMember =
                memberRepo.save(member);


        // =====================================================
        // MEMBER NOTIFICATION
        // =====================================================

        notificationService.createMemberNotification(
                savedMember,
                "Membership Renewed",
                "Your membership has been renewed successfully. "
                        + "New expiry date: "
                        + newExpiryDate
                        + ".",
                "MEMBERSHIP",
                "MEMBERSHIP",
                savedMember.getId()
        );


        // =====================================================
        // ADMIN NOTIFICATION
        // =====================================================

        notificationService.createAdminNotification(
                "Membership Renewed",
                "Member "
                        + savedMember.getFullName()
                        + " has renewed their membership.",
                "MEMBERSHIP",
                "MEMBERSHIP",
                savedMember.getId()
        );


        return savedMember;
    }


    // =========================================================
    // DOCUMENT VERIFICATION
    // =========================================================

    public Member updateVerificationStatus(
            Long id,
            String verificationStatus,
            String rejectionReason) {

        Member member = memberRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        if (member.getVerificationDocument() == null ||
                member.getVerificationDocument().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "No verification document has been uploaded"
            );
        }

        if (verificationStatus == null ||
                verificationStatus.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Verification status is required"
            );
        }

        String newStatus =
                verificationStatus.trim().toUpperCase();

        if (!newStatus.equals("VERIFIED") &&
                !newStatus.equals("REJECTED") &&
                !newStatus.equals("PENDING")) {

            throw new IllegalArgumentException(
                    "Invalid verification status"
            );
        }

        String cleanReason =
                rejectionReason == null
                        ? ""
                        : rejectionReason.trim();

        // =====================================================
        // REJECTION REASON REQUIRED
        // =====================================================

        if ("REJECTED".equals(newStatus) &&
                cleanReason.isEmpty()) {

            throw new IllegalArgumentException(
                    "A rejection reason is required"
            );
        }

        member.setVerificationStatus(newStatus);

        Member savedMember =
                memberRepo.save(member);

        // =====================================================
        // MEMBER NOTIFICATION
        // =====================================================

        String title;
        String message;
        String notificationType;

        if ("VERIFIED".equals(newStatus)) {

            title = "Verification Approved";

            message =
                    "Your verification document has been verified successfully.";

            notificationType = "MEMBERSHIP_VERIFICATION_APPROVED";

        } else if ("REJECTED".equals(newStatus)) {

            title = "Verification Rejected";

            message =
                    "Your verification document has been rejected. "
                            + "Reason: "
                            + cleanReason;

            notificationType = "MEMBERSHIP_VERIFICATION_REJECTED";

        } else {

            title = "Verification Status Updated";

            message =
                    "Your verification status has been updated to PENDING.";

            notificationType = "MEMBERSHIP";
        }

        notificationService.createMemberNotification(
                savedMember,
                title,
                message,
                notificationType,
                "MEMBERSHIP",
                savedMember.getId()
        );

        return savedMember;
    }


    // =========================================================
    // REQUEST MEMBERSHIP TYPE CHANGE
    // =========================================================

    public MembershipTypeChangeRequest requestMembershipTypeChange(
            Long memberId,
            String requestedMembershipType,
            String reason) {

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
                reason == null
                        ? ""
                        : reason.trim()
        );

        request.setStatus("PENDING");

        request.setRequestedAt(
                java.time.LocalDateTime.now()
        );

        MembershipTypeChangeRequest savedRequest =
                membershipTypeChangeRequestRepository.save(request);

        // =====================================================
        // ADMIN NOTIFICATION
        // =====================================================

        notificationService.createAdminNotification(
                "Membership Type Change Request",
                "Member "
                        + member.getFullName()
                        + " requested a membership type change from "
                        + member.getMembershipType()
                        + " to "
                        + requestedMembershipType
                        + ".",
                "MEMBERSHIP_TYPE_CHANGE",
                "MEMBERSHIP",
                savedRequest.getId()
        );

        return savedRequest;
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
        Member member =
                memberRepo.findById(request.getMemberId())
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

        Member savedMember =
                memberRepo.save(member);

        // =====================================================
        // MEMBER NOTIFICATION
        // =====================================================

        notificationService.createMemberNotification(
                savedMember,
                "Membership Type Change Approved",
                "Your membership type has been changed to "
                        + newMembershipType
                        + ".",
                "MEMBERSHIP_TYPE_APPROVED",
                "MEMBERSHIP",
                savedMember.getId()
        );

        return savedMember;
    }


    // =========================================================
    // REJECT MEMBERSHIP TYPE CHANGE
    // =========================================================

    public MembershipTypeChangeRequest rejectMembershipTypeChange(
            Long requestId,
            String rejectionReason) {

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

        String cleanReason =
                rejectionReason == null
                        ? ""
                        : rejectionReason.trim();

        // Rejection reason is required
        if (cleanReason.isEmpty()) {

            throw new IllegalArgumentException(
                    "A rejection reason is required"
            );
        }

        request.setStatus("REJECTED");

        request.setProcessedAt(
                java.time.LocalDateTime.now()
        );

        MembershipTypeChangeRequest savedRequest =
                membershipTypeChangeRequestRepository.save(request);

        Member member =
                memberRepo.findById(request.getMemberId())
                        .orElse(null);

        if (member != null) {

            // =================================================
            // MEMBER NOTIFICATION WITH REJECTION REASON
            // =================================================

            notificationService.createMemberNotification(
                    member,
                    "Membership Type Change Rejected",
                    "Your request to change membership type has been rejected. "
                            + "Reason: "
                            + cleanReason,
                    "MEMBERSHIP_TYPE_REJECTED",
                    "MEMBERSHIP",
                    member.getId()
            );
        }

        return savedRequest;
    }

        // =========================================================
        // VERIFICATION DOCUMENT UPLOADED
        // =========================================================

        public void notifyVerificationDocumentUploaded (Member member){

            notificationService.createAdminNotification(
                    "Verification Document Uploaded",
                    "Member " + member.getFullName()
                            + " has uploaded a new verification document for review.",
                    "MEMBERSHIP_VERIFICATION",
                    "MEMBERSHIP",
                    member.getId()
            );
        }
    }