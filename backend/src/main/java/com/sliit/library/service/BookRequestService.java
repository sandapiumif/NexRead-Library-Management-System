package com.sliit.library.service;

import com.sliit.library.model.Book;
import com.sliit.library.model.BookRequest;
import com.sliit.library.model.Member;
import com.sliit.library.repository.BookRepository;
import com.sliit.library.repository.BookRequestRepository;
import com.sliit.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookRequestService {

    @Autowired
    private BookRequestRepository bookRequestRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private BookRepository bookRepo;


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


        return bookRequestRepo.save(request);
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


        return bookRequestRepo.save(request);
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
    }
}