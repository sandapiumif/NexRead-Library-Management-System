package com.sliit.library.service;

import com.sliit.library.model.Book;
import com.sliit.library.model.BorrowingRecord;
import com.sliit.library.model.Fine;
import com.sliit.library.model.Member;
import com.sliit.library.model.Reservation;
import com.sliit.library.repository.ReservationRepository;
import com.sliit.library.repository.BookRepository;
import com.sliit.library.repository.BorrowingRepository;
import com.sliit.library.repository.FineRepository;
import com.sliit.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.Comparator;
import java.math.BigDecimal;
import java.time.LocalDate;
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

    @Autowired
    private ReservationRepository reservationRepo;

    @Autowired
    private ReservationService reservationService;

    // Notification service
    @Autowired
    private NotificationService notificationService;

    private static final List<String> ACTIVE_STATUSES =
            List.of("BORROWED", "OVERDUE");


    // =========================================================
    // REFRESH OVERDUE STATUSES
    // =========================================================

    private void refreshOverdueStatuses() {

        LocalDate today = LocalDate.now();

        List<BorrowingRecord> activeBorrowings =
                borrowingRepo.findByStatus("BORROWED");

        boolean changed = false;

        for (BorrowingRecord record : activeBorrowings) {

            if (record.getDueDate() != null
                    && record.getDueDate().isBefore(today)) {

                // Change status to OVERDUE
                record.setStatus("OVERDUE");

                changed = true;

                // -------------------------------------------------
                // OVERDUE NOTIFICATION
                // -------------------------------------------------

                Member member = record.getMember();
                Book book = record.getBook();

                if (member != null) {

                    String bookTitle =
                            book != null
                                    ? book.getTitle()
                                    : "your borrowed book";

                    notificationService.createMemberNotification(
                            member,
                            "Book Overdue",
                            "Your borrowed book \"" + bookTitle
                                    + "\" is overdue. Please return it as soon as possible.",
                            "OVERDUE",
                            "BORROWING",
                            record.getId()
                    );
                }
            }
        }

        if (changed) {
            borrowingRepo.saveAll(activeBorrowings);
        }
    }


    // =========================================================
    // GET ALL BORROWINGS
    // =========================================================

    @Transactional
    public List<BorrowingRecord> getAllBorrowings() {

        refreshOverdueStatuses();

        return borrowingRepo.findAll();
    }


    // =========================================================
    // GET BORROWING BY ID
    // =========================================================

    @Transactional
    public Optional<BorrowingRecord> getBorrowingById(Long id) {

        refreshOverdueStatuses();

        return borrowingRepo.findById(id);
    }


    // =========================================================
    // GET BORROWINGS BY MEMBER
    // =========================================================

    @Transactional
    public List<BorrowingRecord> getBorrowingsByMemberId(Long memberId) {

        refreshOverdueStatuses();

        return borrowingRepo.findByMemberId(memberId);
    }


    // =========================================================
    // DIRECT LIBRARIAN ISSUE
    // =========================================================

    public BorrowingRecord borrowBook(Long memberId, Long bookId) {

        return borrowBook(
                memberId,
                bookId,
                "Issued by librarian"
        );
    }


    // =========================================================
    // ISSUE BOOK
    // =========================================================

    @Transactional
    public BorrowingRecord borrowBook(
            Long memberId,
            Long bookId,
            String notes) {

        refreshOverdueStatuses();

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


        // -----------------------------------------------------
        // MEMBER ELIGIBILITY
        // -----------------------------------------------------

        validateMemberEligibility(member);


        // -----------------------------------------------------
        // CHECK UNPAID FINES
        // -----------------------------------------------------

        List<Fine> unpaidFines =
                fineRepo.findByMemberIdAndStatus(
                        memberId,
                        "PENDING"
                );

        if (!unpaidFines.isEmpty()) {

            throw new IllegalStateException(
                    "Member has outstanding unpaid fines. "
                            + "Fines must be paid before borrowing."
            );
        }


        // -----------------------------------------------------
        // CHECK BORROWING LIMIT
        // -----------------------------------------------------

        long activeLoans =
                borrowingRepo.countByMemberIdAndStatusIn(
                        memberId,
                        ACTIVE_STATUSES
                );

        if (activeLoans >= member.getMaxBorrowLimit()) {

            throw new IllegalStateException(
                    "Borrowing limit reached (maximum "
                            + member.getMaxBorrowLimit()
                            + " books allowed)"
            );
        }


        // -----------------------------------------------------
        // CHECK SAME BOOK
        // -----------------------------------------------------

        List<BorrowingRecord> sameBookActive =
                borrowingRepo
                        .findByMemberIdAndBookIdAndStatusIn(
                                memberId,
                                bookId,
                                ACTIVE_STATUSES
                        );

        if (!sameBookActive.isEmpty()) {

            throw new IllegalStateException(
                    "Member already has this book on loan."
            );
        }


        // -----------------------------------------------------
        // CHECK BOOK AVAILABILITY
        // -----------------------------------------------------

        if (book.getAvailableCopies() <= 0) {

            throw new IllegalStateException(
                    "Book is currently out of stock. "
                            + "You can place a reservation instead."
            );
        }

        // CHECK RESERVATION QUEUE
        List<Reservation> activeReservations =
                reservationRepo.findByBookIdAndStatus(bookId, "ACTIVE");

        activeReservations.sort(
                Comparator.comparingInt(
                        Reservation::getWaitingPosition
                )
        );

        if (!activeReservations.isEmpty()) {

            Reservation firstReservation =
                    activeReservations.get(0);

            Long firstMemberId =
                    firstReservation.getMember().getId();

            if (!firstMemberId.equals(memberId)) {
                throw new IllegalStateException(
                        "This book is currently reserved for another member. "
                                + "Please wait until it is your turn."
                );
            }
        }


        // -----------------------------------------------------
        // DECREASE BOOK COPY
        // -----------------------------------------------------

        book.setAvailableCopies(
                book.getAvailableCopies() - 1
        );

        book.setStatus(
                book.getAvailableCopies() > 0
                        ? "AVAILABLE"
                        : "BORROWED"
        );

        bookRepo.save(book);


        // -----------------------------------------------------
        // CREATE BORROWING RECORD
        // -----------------------------------------------------

        BorrowingRecord record =
                new BorrowingRecord();

        long count =
                borrowingRepo.count() + 3001;

        record.setBorrowCode(
                "BRW-" + count
        );

        record.setMember(member);

        record.setBook(book);

        LocalDate today =
                LocalDate.now();

        record.setBorrowDate(today);

        record.setDueDate(
                today.plusDays(14)
        );

        record.setStatus("BORROWED");

        record.setNotes(
                notes == null || notes.isBlank()
                        ? "Issued for 14 days standard loan"
                        : notes
        );

        BorrowingRecord savedRecord =
                borrowingRepo.save(record);

        // COMPLETE THE RESERVATION IF THIS MEMBER
        // WAS THE FIRST PERSON IN THE QUEUE
        reservationService.fulfillReservationForBorrow(
                memberId,
                bookId
        );


        // -----------------------------------------------------
        // MEMBER NOTIFICATION
        // -----------------------------------------------------

        notificationService.createMemberNotification(
                member,
                "Book Issued",
                "The book \"" + book.getTitle()
                        + "\" has been issued to you. "
                        + "Due date: "
                        + savedRecord.getDueDate() + ".",
                "BORROWING_ISSUED",
                "BORROWING",
                savedRecord.getId()
        );


        return savedRecord;
    }


    // =========================================================
    // VALIDATE MEMBER
    // =========================================================

    private void validateMemberEligibility(Member member) {

        if (!"ACTIVE".equalsIgnoreCase(member.getStatus())) {

            throw new IllegalStateException(
                    "Member is suspended or inactive. "
                            + "Please clear any dues first."
            );
        }

        if (member.getExpiryDate() != null
                && member.getExpiryDate()
                .isBefore(LocalDate.now())) {

            throw new IllegalStateException(
                    "Membership has expired. "
                            + "Please renew the membership before borrowing."
            );
        }
    }


    // =========================================================
    // RETURN BOOK
    // =========================================================

    @Transactional
    public BorrowingRecord returnBook(Long borrowingId) {

        refreshOverdueStatuses();

        BorrowingRecord record =
                borrowingRepo.findById(borrowingId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Borrowing record not found"
                                )
                        );


        // -----------------------------------------------------
        // VALIDATE STATUS
        // -----------------------------------------------------

        if ("RETURNED".equalsIgnoreCase(record.getStatus())) {

            throw new IllegalStateException(
                    "Book has already been returned"
            );
        }

        if (!"BORROWED".equalsIgnoreCase(record.getStatus())
                && !"OVERDUE".equalsIgnoreCase(record.getStatus())) {

            throw new IllegalStateException(
                    "Only active borrowed or overdue books can be returned"
            );
        }


        LocalDate today =
                LocalDate.now();

        boolean overdue =
                today.isAfter(record.getDueDate());


        // -----------------------------------------------------
        // RETURN INFORMATION
        // -----------------------------------------------------

        record.setReturnDate(today);

        record.setStatus("RETURNED");


        // -----------------------------------------------------
        // RESTOCK BOOK
        // -----------------------------------------------------

        Book book = record.getBook();

        if (book.getAvailableCopies() < book.getTotalCopies()) {

            book.setAvailableCopies(
                    book.getAvailableCopies() + 1
            );
        }

        book.setStatus(
                book.getAvailableCopies() > 0
                        ? "AVAILABLE"
                        : "BORROWED"
        );

        bookRepo.save(book);


    // -----------------------------------------------------
    // NOTIFY FIRST RESERVATION MEMBER
    // -----------------------------------------------------

        reservationService.notifyNextEligibleReservation(
                book.getId()
        );




        // -----------------------------------------------------
        // CREATE FINE IF OVERDUE
        // -----------------------------------------------------

        Fine createdFine = null;

        if (overdue
                && fineRepo
                .findByBorrowingId(record.getId())
                .isEmpty()) {

            long overdueDays =
                    java.time.temporal.ChronoUnit.DAYS.between(
                            record.getDueDate(),
                            today
                    );

            BigDecimal fineAmount =
                    BigDecimal.valueOf(
                            overdueDays * 10L
                    );


            Fine fine =
                    new Fine();

            long fineCount =
                    fineRepo.count() + 5001;

            fine.setFineCode(
                    "FINE-" + fineCount
            );

            fine.setMember(
                    record.getMember()
            );

            fine.setBorrowing(
                    record
            );

            fine.setOverdueDays(
                    (int) overdueDays
            );

            fine.setAmount(
                    fineAmount
            );

            fine.setStatus(
                    "PENDING"
            );

            createdFine =
                    fineRepo.save(fine);


            // -------------------------------------------------
            // SUSPEND MEMBER
            // -------------------------------------------------

            Member member =
                    record.getMember();

            if (member != null) {

                member.setStatus("SUSPENDED");

                memberRepo.save(member);
            }


            // -------------------------------------------------
            // FINE NOTIFICATION
            // -------------------------------------------------

            if (record.getMember() != null) {

                notificationService.createMemberNotification(
                        record.getMember(),
                        "Overdue Fine Created",
                        "A fine of Rs. "
                                + fineAmount
                                + " has been created for the overdue book \""
                                + book.getTitle()
                                + "\". Overdue days: "
                                + overdueDays
                                + ".",
                        "FINE",
                        "FINE",
                        createdFine.getId()
                );
            }
        }


        // -----------------------------------------------------
        // RETURN NOTIFICATION
        // -----------------------------------------------------

        if (record.getMember() != null) {

            notificationService.createMemberNotification(
                    record.getMember(),
                    "Book Returned",
                    "The book \"" + book.getTitle()
                            + "\" has been successfully returned.",
                    "BORROWING_RETURNED",
                    "BORROWING",
                    record.getId()
            );

            notificationService.createAdminNotification(
                    "Book Returned",
                    "Member " + record.getMember().getFullName() + " returned \"" + book.getTitle() + "\".",
                    "BORROWING_RETURNED",
                    "BORROWING",
                    record.getId()
            );
        }


        return borrowingRepo.save(record);
    }


    // =========================================================
    // UPDATE BORROWING
    // =========================================================

    @Transactional
    public BorrowingRecord updateBorrowing(
            Long id,
            BorrowingRecord updatedRecord) {

        refreshOverdueStatuses();

        BorrowingRecord record =
                borrowingRepo.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Borrowing record not found"
                                )
                        );


        if (!"BORROWED".equalsIgnoreCase(record.getStatus())
                && !"OVERDUE".equalsIgnoreCase(record.getStatus())) {

            throw new IllegalStateException(
                    "Only active borrowing records can be updated"
            );
        }


        if (updatedRecord.getDueDate() == null) {

            throw new IllegalArgumentException(
                    "Due date is required"
            );
        }


        if (updatedRecord.getDueDate()
                .isBefore(record.getBorrowDate())) {

            throw new IllegalArgumentException(
                    "Due date cannot be before borrow date"
            );
        }


        record.setDueDate(
                updatedRecord.getDueDate()
        );

        record.setNotes(
                updatedRecord.getNotes()
        );

        record.setStatus(
                record.getDueDate()
                        .isBefore(LocalDate.now())
                        ? "OVERDUE"
                        : "BORROWED"
        );


        BorrowingRecord savedRecord =
                borrowingRepo.save(record);


        // -----------------------------------------------------
        // DUE DATE UPDATE NOTIFICATION
        // -----------------------------------------------------

        if (record.getMember() != null
                && record.getBook() != null) {

            notificationService.createMemberNotification(
                    record.getMember(),
                    "Borrowing Details Updated",
                    "The due date for \""
                            + record.getBook().getTitle()
                            + "\" has been updated to "
                            + record.getDueDate()
                            + ".",
                    "BORROWING_UPDATED",
                    "BORROWING",
                    record.getId()
            );
        }


        return savedRecord;
    }


    // =========================================================
    // CANCEL BORROWING
    // =========================================================

    @Transactional
    public void deleteBorrowing(Long id) {

        BorrowingRecord record =
                borrowingRepo.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Borrowing record not found"
                                )
                        );


        if (!"BORROWED".equalsIgnoreCase(record.getStatus())) {

            throw new IllegalStateException(
                    "Only an active non-overdue borrowing can be cancelled"
            );
        }


        record.setStatus("CANCELLED");


        Book book =
                record.getBook();

        if (book.getAvailableCopies()
                < book.getTotalCopies()) {

            book.setAvailableCopies(
                    book.getAvailableCopies() + 1
            );
        }

        book.setStatus(
                book.getAvailableCopies() > 0
                        ? "AVAILABLE"
                        : "BORROWED"
        );

        bookRepo.save(book);

        borrowingRepo.save(record);


        // -----------------------------------------------------
        // CANCELLATION NOTIFICATION
        // -----------------------------------------------------

        if (record.getMember() != null
                && book != null) {

            notificationService.createMemberNotification(
                    record.getMember(),
                    "Borrowing Cancelled",
                    "The borrowing record for \""
                            + book.getTitle()
                            + "\" has been cancelled.",
                    "BORROWING_CANCELLED",
                    "BORROWING",
                    record.getId()
            );

            notificationService.createAdminNotification(
                    "Borrowing Cancelled",
                    "Borrowing record for member " + record.getMember().getFullName() + " and book \"" + book.getTitle() + "\" was cancelled.",
                    "BORROWING_CANCELLED",
                    "BORROWING",
                    record.getId()
            );
        }
    }
}