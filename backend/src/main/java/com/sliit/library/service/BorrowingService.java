package com.sliit.library.service;

import com.sliit.library.model.Book;
import com.sliit.library.model.BorrowingRecord;
import com.sliit.library.model.Fine;
import com.sliit.library.model.Member;
import com.sliit.library.repository.BookRepository;
import com.sliit.library.repository.BorrowingRepository;
import com.sliit.library.repository.FineRepository;
import com.sliit.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowingService {

    @Autowired
    private BorrowingRepository borrowingRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private FineRepository fineRepo;


    // Get all borrowing records
    public List<BorrowingRecord> getAllBorrowings() {
        return borrowingRepo.findAll();
    }


    // Get borrowing record by ID
    public Optional<BorrowingRecord> getBorrowingById(Long id) {
        return borrowingRepo.findById(id);
    }


    // Issue a book to a member
    public BorrowingRecord borrowBook(Long memberId, Long bookId) {

        Member member = memberRepo.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        Book book = bookRepo.findById(bookId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Book not found"));


        // Check if member is active
        if (!"ACTIVE".equalsIgnoreCase(member.getStatus())) {
            throw new IllegalStateException(
                    "Member is suspended or inactive. Please clear any dues first.");
        }


        // Check for unpaid fines
        List<Fine> unpaidFines =
                fineRepo.findByMemberIdAndStatus(memberId, "PENDING");

        if (!unpaidFines.isEmpty()) {
            throw new IllegalStateException(
                    "Member has outstanding unpaid fines. Fines must be paid before borrowing.");
        }


        // Check current active loans
        long activeLoans =
                borrowingRepo.countByMemberIdAndStatus(
                        memberId,
                        "BORROWED"
                );

        if (activeLoans >= member.getMaxBorrowLimit()) {
            throw new IllegalStateException(
                    "Borrowing limit reached (maximum "
                            + member.getMaxBorrowLimit()
                            + " books allowed)");
        }


        // Check book availability
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException(
                    "Book is currently out of stock. You can place a reservation instead.");
        }


        // Decrease available copies
        book.setAvailableCopies(
                book.getAvailableCopies() - 1
        );

        if (book.getAvailableCopies() == 0) {
            book.setStatus("BORROWED");
        }

        bookRepo.save(book);


        // Create borrowing record
        BorrowingRecord record = new BorrowingRecord();

        long count = borrowingRepo.count() + 3001;

        record.setBorrowCode("BRW-" + count);
        record.setMember(member);
        record.setBook(book);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(14));
        record.setStatus("BORROWED");
        record.setNotes("Issued for 14 days standard loan");


        return borrowingRepo.save(record);
    }


    // Process book return
    public BorrowingRecord returnBook(Long borrowingId) {

        BorrowingRecord record = borrowingRepo.findById(borrowingId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Borrowing record not found"));


        if ("RETURNED".equalsIgnoreCase(record.getStatus())) {
            throw new IllegalStateException(
                    "Book has already been returned");
        }


        LocalDate today = LocalDate.now();

        record.setReturnDate(today);
        record.setStatus("RETURNED");


        // Restock the book
        Book book = record.getBook();

        book.setAvailableCopies(
                book.getAvailableCopies() + 1
        );

        if (book.getAvailableCopies() > 0) {
            book.setStatus("AVAILABLE");
        }

        bookRepo.save(book);


        // Check for overdue and create fine
        if (today.isAfter(record.getDueDate())) {

            long overdueDays =
                    ChronoUnit.DAYS.between(
                            record.getDueDate(),
                            today
                    );

            BigDecimal fineAmount =
                    BigDecimal.valueOf(overdueDays * 10.0);


            Fine fine = new Fine();

            long fineCount = fineRepo.count() + 5001;

            fine.setFineCode("FINE-" + fineCount);
            fine.setMember(record.getMember());
            fine.setBorrowing(record);
            fine.setOverdueDays((int) overdueDays);
            fine.setAmount(fineAmount);
            fine.setStatus("PENDING");

            fineRepo.save(fine);


            // Suspend member until fine is paid
            Member member = record.getMember();

            member.setStatus("SUSPENDED");

            memberRepo.save(member);
        }


        return borrowingRepo.save(record);
    }


    // Update borrowing details
    public BorrowingRecord updateBorrowing(
            Long id,
            BorrowingRecord updatedRecord) {

        BorrowingRecord record = borrowingRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Borrowing record not found"));


        if ("RETURNED".equalsIgnoreCase(record.getStatus())) {
            throw new IllegalStateException(
                    "A returned borrowing record cannot be updated");
        }


        if (updatedRecord.getDueDate() == null) {
            throw new IllegalArgumentException(
                    "Due date is required");
        }


        if (updatedRecord.getDueDate()
                .isBefore(record.getBorrowDate())) {

            throw new IllegalArgumentException(
                    "Due date cannot be before borrow date");
        }


        record.setDueDate(updatedRecord.getDueDate());
        record.setNotes(updatedRecord.getNotes());


        return borrowingRepo.save(record);
    }


    // Delete / cancel borrowing record
    public void deleteBorrowing(Long id) {

        BorrowingRecord record = borrowingRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Borrowing record not found"));


        if ("RETURNED".equalsIgnoreCase(record.getStatus())) {
            throw new IllegalStateException(
                    "A returned borrowing record cannot be cancelled");
        }


        record.setStatus("CANCELLED");


        // Return the book copy to inventory
        Book book = record.getBook();

        if (book.getAvailableCopies() < book.getTotalCopies()) {
            book.setAvailableCopies(
                    book.getAvailableCopies() + 1
            );
        }


        if (book.getAvailableCopies() > 0) {
            book.setStatus("AVAILABLE");
        }

        bookRepo.save(book);

        borrowingRepo.save(record);
    }
}