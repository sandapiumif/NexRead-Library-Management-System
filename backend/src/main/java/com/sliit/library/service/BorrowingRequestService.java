package com.sliit.library.service;

import com.sliit.library.model.Book;
import com.sliit.library.model.BorrowingRequest;
import com.sliit.library.model.Member;
import com.sliit.library.repository.BookRepository;
import com.sliit.library.repository.BorrowingRequestRepository;
import com.sliit.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowingRequestService {

    @Autowired
    private BorrowingRequestRepository requestRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private BorrowingService borrowingService;

    @Autowired
    private NotificationService notificationService;


    // =========================================================
    // GET ALL REQUESTS
    // =========================================================

    public List<BorrowingRequest> getAllRequests() {
        return requestRepo.findAll();
    }


    // =========================================================
    // GET REQUESTS BY MEMBER
    // =========================================================

    public List<BorrowingRequest> getRequestsByMember(Long memberId) {
        return requestRepo.findByMemberId(memberId);
    }


    // =========================================================
    // GET REQUEST BY ID
    // =========================================================

    public Optional<BorrowingRequest> getRequestById(Long id) {
        return requestRepo.findById(id);
    }


    // =========================================================
    // CREATE BORROWING REQUEST
    // =========================================================

    @Transactional
    public BorrowingRequest createRequest(
            Long memberId,
            Long bookId,
            String notes
    ) {

        Member member = memberRepo.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Member not found"
                        )
                );

        Book book = bookRepo.findById(bookId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Book not found"
                        )
                );


        // Member must be active
        if (!"ACTIVE".equalsIgnoreCase(member.getStatus())) {
            throw new IllegalStateException(
                    "Only active members can submit borrowing requests."
            );
        }


        // Membership expiry check
        if (
                member.getExpiryDate() != null &&
                        member.getExpiryDate().isBefore(LocalDate.now())
        ) {
            throw new IllegalStateException(
                    "Membership has expired. Please renew before requesting a book."
            );
        }


        // Book availability check
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException(
                    "This book is currently unavailable. Please use the reservation option instead."
            );
        }


        // Prevent duplicate pending request
        if (
                requestRepo.existsByMemberIdAndBookIdAndStatus(
                        memberId,
                        bookId,
                        "PENDING"
                )
        ) {
            throw new IllegalStateException(
                    "You already have a pending borrowing request for this book."
            );
        }


        // Create request
        BorrowingRequest request = new BorrowingRequest();

        request.setRequestCode(
                "BRQ-" + (requestRepo.count() + 4001)
        );

        request.setMember(member);

        request.setBook(book);

        request.setStatus("PENDING");

        request.setRequestedAt(
                LocalDateTime.now()
        );

        request.setNotes(
                notes == null ? "" : notes.trim()
        );


        BorrowingRequest savedRequest =
                requestRepo.save(request);


        // =====================================================
        // ADMIN NOTIFICATION
        // =====================================================

        notificationService.createAdminNotification(
                "New Borrowing Request",
                "Member " + member.getFullName()
                        + " has submitted a borrowing request for \""
                        + book.getTitle()
                        + "\".",
                "BORROWING_REQUEST",
                "BORROWING_REQUEST",
                savedRequest.getId()
        );


        return savedRequest;
    }


    // =========================================================
    // APPROVE BORROWING REQUEST
    // =========================================================

    @Transactional
    public BorrowingRequest approveRequest(Long id) {

        BorrowingRequest request = requestRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Borrowing request not found"
                        )
                );


        // Only pending requests can be approved
        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException(
                    "Only pending borrowing requests can be approved."
            );
        }


        // Re-run borrowing validations and create borrowing transaction
        borrowingService.borrowBook(
                request.getMember().getId(),
                request.getBook().getId(),
                "Approved borrowing request " +
                        request.getRequestCode()
        );


        // Update request status
        request.setStatus("APPROVED");


        String existingNotes =
                request.getNotes() == null
                        ? ""
                        : request.getNotes().trim();


        String approvalNote =
                "Approved by librarian";


        if (existingNotes.isEmpty()) {

            request.setNotes(approvalNote);

        } else {

            request.setNotes(
                    existingNotes + " | " + approvalNote
            );
        }


        BorrowingRequest savedRequest =
                requestRepo.save(request);


        // =====================================================
        // MEMBER NOTIFICATION
        // =====================================================

        notificationService.createMemberNotification(
                request.getMember(),
                "Borrowing Request Approved",
                "Your borrowing request for \""
                        + request.getBook().getTitle()
                        + "\" has been approved. "
                        + "The book has been issued to you.",
                "BORROWING_APPROVED",
                "BORROWING_REQUEST",
                savedRequest.getId()
        );


        /*
         * NOTE:
         * BorrowingService.borrowBook() already creates a
         * "Book Issued" notification.
         *
         * Therefore this approval notification is useful because
         * it tells the member that the request itself was approved.
         * The issued notification separately confirms the actual loan.
         */


        return savedRequest;
    }


    // =========================================================
    // REJECT BORROWING REQUEST
    // =========================================================

    @Transactional
    public BorrowingRequest rejectRequest(
            Long id,
            String reason
    ) {

        BorrowingRequest request = requestRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Borrowing request not found"
                        )
                );


        // Only pending requests can be rejected
        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException(
                    "Only pending borrowing requests can be rejected."
            );
        }


        String cleanReason =
                reason == null
                        ? ""
                        : reason.trim();


        // Rejection reason is required
        if (cleanReason.isEmpty()) {
            throw new IllegalArgumentException(
                    "A rejection reason is required."
            );
        }


        request.setStatus("REJECTED");


        String existingNotes =
                request.getNotes() == null
                        ? ""
                        : request.getNotes().trim();


        String rejectionNote =
                "Rejection reason: " + cleanReason;


        if (existingNotes.isEmpty()) {

            request.setNotes(rejectionNote);

        } else {

            request.setNotes(
                    existingNotes +
                            " | " +
                            rejectionNote
            );
        }


        BorrowingRequest savedRequest =
                requestRepo.save(request);


        // =====================================================
        // MEMBER NOTIFICATION
        // =====================================================

        notificationService.createMemberNotification(
                request.getMember(),
                "Borrowing Request Rejected",
                "Your borrowing request for \""
                        + request.getBook().getTitle()
                        + "\" has been rejected. "
                        + "Reason: "
                        + cleanReason,
                "BORROWING_REJECTED",
                "BORROWING_REQUEST",
                savedRequest.getId()
        );


        return savedRequest;
    }


    // =========================================================
    // CANCEL BORROWING REQUEST
    // =========================================================

    @Transactional
    public BorrowingRequest cancelRequest(
            Long id,
            Long memberId
    ) {

        BorrowingRequest request = requestRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Borrowing request not found"
                        )
                );


        // Member can only cancel own request
        if (
                !request.getMember()
                        .getId()
                        .equals(memberId)
        ) {
            throw new IllegalStateException(
                    "You can only cancel your own borrowing requests."
            );
        }


        // Only pending requests can be cancelled
        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalStateException(
                    "Only pending borrowing requests can be cancelled."
            );
        }


        request.setStatus("CANCELLED");


        BorrowingRequest savedRequest =
                requestRepo.save(request);


        // =====================================================
        // ADMIN NOTIFICATION
        // =====================================================

        notificationService.createAdminNotification(
                "Borrowing Request Cancelled",
                "Member " + request.getMember().getFullName()
                        + " has cancelled borrowing request "
                        + request.getRequestCode()
                        + " for \""
                        + request.getBook().getTitle()
                        + "\".",
                "BORROWING_REQUEST_CANCELLED",
                "BORROWING_REQUEST",
                savedRequest.getId()
        );


        return savedRequest;
    }
}