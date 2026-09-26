package com.sliit.library.service;

import com.sliit.library.model.Book;
import com.sliit.library.model.BookRequest;
import com.sliit.library.model.Member;
import com.sliit.library.repository.BookRepository;
import com.sliit.library.repository.BookRequestRepository;
import com.sliit.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookRequestService {

    @Autowired
    private BookRequestRepository bookRequestRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private NotificationService notificationService;


    // =========================
    // READ - Get all requests
    // =========================
    public List<BookRequest> getAllBookRequests() {
        return bookRequestRepo.findAll();
    }


    // =========================
    // READ - Get request by ID
    // =========================
    public BookRequest getBookRequestById(Long id) {

        return bookRequestRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Book request not found"
                        )
                );
    }


    // =========================
    // CREATE - Submit request
    // =========================
    public BookRequest submitBookRequest(
            Long memberId,
            BookRequest request) {

        Member member = memberRepo.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Member not found"
                        )
                );


        if (request.getTitle() == null ||
                request.getTitle().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Title is required"
            );
        }


        // Check whether the requested book
        // already exists in the catalogue
        List<Book> existing =
                bookRepo.searchBooks(
                        request.getTitle().trim()
                );

        if (!existing.isEmpty()) {

            throw new IllegalStateException(
                    "This book already exists in our library collection (Title: "
                            + existing.get(0).getTitle()
                            + ")"
            );
        }


        // Generate request code
        long count =
                bookRequestRepo.count() + 6001;

        request.setRequestCode(
                "REQ-" + count
        );

        request.setMember(member);
        request.setStatus("PENDING");
        request.setAdminNotes(
                "Awaiting librarian review"
        );


        BookRequest savedRequest = bookRequestRepo.save(request);

        notificationService.createAdminNotification(
                "New Book Request",
                "Member " + member.getFullName() + " requested the book \"" + request.getTitle() + "\".",
                "BOOK_REQUEST",
                "BOOK_REQUEST",
                savedRequest.getId()
        );

        return savedRequest;
    }


    // =========================
    // UPDATE - Update request
    // status / admin notes
    // =========================
    public BookRequest updateRequestStatus(
            Long requestId,
            String status,
            String notes) {

        BookRequest request =
                bookRequestRepo.findById(requestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Book request not found"
                                )
                        );


        if (status == null ||
                status.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Request status is required"
            );
        }


        request.setStatus(
                status.toUpperCase()
        );


        if (notes != null) {
            request.setAdminNotes(notes);
        }


        BookRequest savedRequest = bookRequestRepo.save(request);

        notificationService.createMemberNotification(
                request.getMember(),
                "Book Request Status Updated",
                "Your book request for \"" + request.getTitle() + "\" is now " + request.getStatus() + "."
                        + ((notes != null && !notes.trim().isEmpty()) ? " Note: " + notes.trim() : ""),
                "BOOK_REQUEST",
                "BOOK_REQUEST",
                savedRequest.getId()
        );

        return savedRequest;
    }


    // =========================
    // DELETE - Cancel request
    // =========================
    public void deleteBookRequest(Long requestId) {

        BookRequest request =
                bookRequestRepo.findById(requestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Book request not found"
                                )
                        );


        // Approved requests cannot be cancelled
        if ("APPROVED".equalsIgnoreCase(
                request.getStatus())) {

            throw new IllegalStateException(
                    "An approved book request cannot be deleted"
            );
        }


        // Soft delete / cancellation
        request.setStatus("CANCELLED");

        bookRequestRepo.save(request);

        notificationService.createAdminNotification(
                "Book Request Cancelled",
                "Member " + request.getMember().getFullName() + " cancelled book request \"" + request.getTitle() + "\".",
                "BOOK_REQUEST_CANCELLED",
                "BOOK_REQUEST",
                request.getId()
        );

        notificationService.createMemberNotification(
                request.getMember(),
                "Book Request Cancelled",
                "Your book request for \"" + request.getTitle() + "\" has been cancelled.",
                "BOOK_REQUEST_CANCELLED",
                "BOOK_REQUEST",
                request.getId()
        );
    }
}