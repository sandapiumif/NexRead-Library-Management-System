package com.sliit.library.service;

import com.sliit.library.model.Book;
import com.sliit.library.model.Member;
import com.sliit.library.model.Reservation;
import com.sliit.library.repository.BookRepository;
import com.sliit.library.repository.MemberRepository;
import com.sliit.library.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private NotificationService notificationService;


    // =========================================================
    // GET ALL RESERVATIONS
    // =========================================================

    public List<Reservation> getAllReservations() {

        return reservationRepo.findAll();
    }


    // =========================================================
    // CREATE RESERVATION
    // =========================================================

    @Transactional
    public Reservation reserveBook(
            Long memberId,
            Long bookId
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


        if (!"ACTIVE".equalsIgnoreCase(member.getStatus())) {

            throw new IllegalStateException(
                    "Only active members can reserve books."
            );
        }


        // A reservation is only needed when no copies
        // are currently available.
        if (book.getAvailableCopies() > 0) {

            throw new IllegalStateException(
                    "This book is available on the shelf and "
                            + "can be borrowed directly!"
            );
        }


        // Prevent duplicate active reservation
        if (reservationRepo
                .existsByMemberIdAndBookIdAndStatus(
                        memberId,
                        bookId,
                        "ACTIVE"
                )) {

            throw new IllegalStateException(
                    "You already have an active reservation "
                            + "for this book."
            );
        }


        // Calculate next queue position
        long activeReservations =
                reservationRepo.countByBookIdAndStatus(
                        bookId,
                        "ACTIVE"
                );

        int position =
                (int) activeReservations + 1;


        Reservation reservation =
                new Reservation();

        reservation.setReservationCode(
                "RES-" + (reservationRepo.count() + 4001)
        );

        reservation.setMember(member);
        reservation.setBook(book);
        reservation.setWaitingPosition(position);

        // ACTIVE = waiting in queue
        reservation.setStatus("ACTIVE");

        // No availability notification has been sent yet.
        reservation.setNotificationSent(false);


        Reservation saved =
                reservationRepo.save(reservation);


        // =====================================================
        // ADMIN NOTIFICATION
        // =====================================================

        notificationService.createAdminNotification(
                "New Reservation",
                "Member "
                        + member.getFullName()
                        + " reserved \""
                        + book.getTitle()
                        + "\". Queue position: #"
                        + position
                        + ".",
                "RESERVATION",
                "RESERVATION",
                saved.getId()
        );


        // =====================================================
        // MEMBER CONFIRMATION
        // =====================================================

        notificationService.createMemberNotification(
                member,
                "Reservation Confirmed",
                "Your reservation for \""
                        + book.getTitle()
                        + "\" has been confirmed. "
                        + "Your current queue position is #"
                        + position
                        + ".",
                "RESERVATION",
                "RESERVATION",
                saved.getId()
        );

// If a copy became available before the reservation
// was created, immediately notify the first member.
        if (book.getAvailableCopies() > 0) {
            notifyNextEligibleReservation(bookId);
        }

        return saved;
    }


    // =========================================================
    // CANCEL RESERVATION
    // =========================================================

    @Transactional
    public Reservation cancelReservation(
            Long reservationId
    ) {

        Reservation reservation =
                reservationRepo.findById(reservationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Reservation not found"
                                )
                        );


        if (!"ACTIVE".equalsIgnoreCase(
                reservation.getStatus()
        )) {

            throw new IllegalStateException(
                    "Only active reservations can be cancelled."
            );
        }


        Long bookId =
                reservation.getBook().getId();


        reservation.setStatus("CANCELLED");


        Reservation saved =
                reservationRepo.save(reservation);


        // Rebuild the queue.
        resequenceQueue(bookId);


        // Notify the member who cancelled.
        notificationService.createMemberNotification(
                reservation.getMember(),
                "Reservation Cancelled",
                "Your reservation for \""
                        + reservation.getBook().getTitle()
                        + "\" has been cancelled.",
                "RESERVATION_CANCELLED",
                "RESERVATION",
                saved.getId()
        );


        // Admin notification
        notificationService.createAdminNotification(
                "Reservation Cancelled",
                "Member "
                        + reservation.getMember().getFullName()
                        + " cancelled reservation "
                        + reservation.getReservationCode()
                        + " for \""
                        + reservation.getBook().getTitle()
                        + "\".",
                "RESERVATION_CANCELLED",
                "RESERVATION",
                saved.getId()
        );


        // =====================================================
        // IMPORTANT
        // If a copy is still available after #1 cancels,
        // notify the new #1.
        // =====================================================

        notifyNextEligibleReservation(bookId);


        return saved;
    }


    // =========================================================
    // UPDATE RESERVATION STATUS
    // =========================================================

    @Transactional
    public Reservation updateReservation(
            Long id,
            String status
    ) {

        Reservation reservation =
                reservationRepo.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Reservation not found"
                                )
                        );


        if (status == null
                || status.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Reservation status is required"
            );
        }


        String newStatus =
                status.trim().toUpperCase();


        if (!newStatus.equals("ACTIVE")
                && !newStatus.equals("CANCELLED")
                && !newStatus.equals("FULFILLED")
                && !newStatus.equals("EXPIRED")) {

            throw new IllegalArgumentException(
                    "Invalid reservation status"
            );
        }


        Long bookId =
                reservation.getBook().getId();


        reservation.setStatus(newStatus);


        if ("ACTIVE".equals(newStatus)) {

            reservation.setNotificationSent(false);
        }


        /*
         * Once a reservation is no longer ACTIVE,
         * remove it from the waiting queue.
         */
        if (!"ACTIVE".equals(newStatus)) {

            reservation.setNotificationSent(false);

            reservationRepo.save(reservation);

            resequenceQueue(bookId);


            /*
             * If the book is still available, the next
             * member can now be notified.
             */
            notifyNextEligibleReservation(bookId);

        } else {

            reservationRepo.save(reservation);
        }


        // =====================================================
        // MEMBER STATUS NOTIFICATION
        // =====================================================

        String title;
        String message;
        String notificationType;


        if ("FULFILLED".equals(newStatus)) {

            title =
                    "Reservation Completed";

            message =
                    "Your reservation for \""
                            + reservation.getBook().getTitle()
                            + "\" has been completed.";

            notificationType =
                    "RESERVATION_FULFILLED";


        } else if ("EXPIRED".equals(newStatus)) {

            title =
                    "Reservation Expired";

            message =
                    "Your reservation for \""
                            + reservation.getBook().getTitle()
                            + "\" has expired.";

            notificationType =
                    "RESERVATION_EXPIRED";


        } else if ("CANCELLED".equals(newStatus)) {

            title =
                    "Reservation Cancelled";

            message =
                    "Your reservation for \""
                            + reservation.getBook().getTitle()
                            + "\" has been cancelled.";

            notificationType =
                    "RESERVATION_CANCELLED";


        } else {

            title =
                    "Reservation Status Updated";

            message =
                    "Your reservation for \""
                            + reservation.getBook().getTitle()
                            + "\" is active. "
                            + "Queue position: #"
                            + reservation.getWaitingPosition()
                            + ".";

            notificationType =
                    "RESERVATION";
        }


        Reservation saved =
                reservationRepo.findById(id)
                        .orElse(reservation);


        notificationService.createMemberNotification(
                reservation.getMember(),
                title,
                message,
                notificationType,
                "RESERVATION",
                saved.getId()
        );


        // =====================================================
        // ADMIN NOTIFICATION
        // =====================================================

        notificationService.createAdminNotification(
                "Reservation Status Updated",
                "Reservation "
                        + reservation.getReservationCode()
                        + " for member "
                        + reservation.getMember().getFullName()
                        + " was changed to "
                        + newStatus
                        + ".",
                "RESERVATION",
                "RESERVATION",
                saved.getId()
        );


        return saved;
    }


    // =========================================================
    // FULFILL RESERVATION AFTER ACTUAL BORROW
    // =========================================================

    @Transactional
    public Reservation fulfillReservationForBorrow(
            Long memberId,
            Long bookId
    ) {

        List<Reservation> activeReservations =
                reservationRepo.findByBookIdAndStatus(
                        bookId,
                        "ACTIVE"
                );


        if (activeReservations.isEmpty()) {
            return null;
        }


        activeReservations.sort(
                Comparator.comparingInt(
                        Reservation::getWaitingPosition
                )
        );


        Reservation firstReservation =
                activeReservations.get(0);


        if (!firstReservation.getMember().getId().equals(memberId)) {

            throw new IllegalStateException(
                    "This book is reserved for another member. "
                            + "Please wait until your turn."
            );
        }


        firstReservation.setStatus("FULFILLED");
        firstReservation.setNotificationSent(false);


        Reservation saved =
                reservationRepo.save(firstReservation);


        // Rebuild remaining queue
        resequenceQueue(bookId);


        return saved;
    }


    // =========================================================
    // RESEQUENCE QUEUE
    // =========================================================

    private void resequenceQueue(Long bookId) {

        List<Reservation> active =
                reservationRepo.findByBookIdAndStatus(
                        bookId,
                        "ACTIVE"
                );


        active.sort(
                Comparator.comparingInt(
                        Reservation::getWaitingPosition
                )
        );


        int position = 1;


        for (Reservation item : active) {

            int oldPosition =
                    item.getWaitingPosition();


            item.setWaitingPosition(position);


            /*
             * Only send a queue-position notification
             * when the position actually changed.
             */
            if (oldPosition != position) {

                notificationService
                        .createMemberNotification(
                                item.getMember(),
                                "Reservation Queue Updated",
                                "Your queue position for \""
                                        + item.getBook().getTitle()
                                        + "\" is now #"
                                        + position
                                        + ".",
                                "RESERVATION",
                                "RESERVATION",
                                item.getId()
                        );
            }


            position++;
        }


        reservationRepo.saveAll(active);
    }


    // =========================================================
    // NOTIFY NEXT ELIGIBLE MEMBER
    // =========================================================

    @Transactional
    public void notifyNextEligibleReservation(
            Long bookId
    ) {

        Book book =
                bookRepo.findById(bookId)
                        .orElse(null);


        if (book == null) {
            return;
        }


        /*
         * No available copy = nobody should be notified.
         */
        if (book.getAvailableCopies() <= 0) {
            return;
        }


        List<Reservation> active =
                reservationRepo.findByBookIdAndStatus(
                        bookId,
                        "ACTIVE"
                );


        if (active.isEmpty()) {
            return;
        }


        /*
         * Always determine the queue from the actual
         * waiting position.
         */
        active.sort(
                Comparator.comparingInt(
                        Reservation::getWaitingPosition
                )
        );


        Reservation first =
                active.get(0);


        /*
         * If the first member has already been notified
         * for this availability, do not send a duplicate.
         */
        if (first.isNotificationSent()) {
            return;
        }


        notificationService.createMemberNotification(
                first.getMember(),
                "Book Available",
                "The book \""
                        + book.getTitle()
                        + "\" is now available. "
                        + "You are first in the reservation queue. "
                        + "You can now borrow the book.",
                "RESERVATION_BOOK_AVAILABLE",
                "RESERVATION",
                first.getId()
        );


        /*
         * Mark the notification as sent AFTER creating it.
         * This prevents duplicate notifications.
         */
        first.setNotificationSent(true);

        reservationRepo.save(first);
    }
}