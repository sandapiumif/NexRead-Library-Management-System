package com.sliit.library.service;

import com.sliit.library.model.Book;
import com.sliit.library.model.Member;
import com.sliit.library.model.Reservation;
import com.sliit.library.repository.BookRepository;
import com.sliit.library.repository.MemberRepository;
import com.sliit.library.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private BookRepository bookRepo;


    // Get all reservations
    public List<Reservation> getAllReservations() {
        return reservationRepo.findAll();
    }


    // Create a new reservation
    public Reservation reserveBook(Long memberId, Long bookId) {

        Member member = memberRepo.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Member not found"));

        Book book = bookRepo.findById(bookId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Book not found"));


        // Only ACTIVE members can reserve books
        if (!"ACTIVE".equalsIgnoreCase(member.getStatus())) {
            throw new IllegalStateException(
                    "Only active members can reserve books.");
        }


        // Cannot reserve if book is available
        if (book.getAvailableCopies() > 0) {
            throw new IllegalStateException(
                    "This book is available on the shelf and can be borrowed directly!");
        }


        // Calculate waiting-list position
        long activeReservations =
                reservationRepo.countByBookIdAndStatus(
                        bookId,
                        "ACTIVE"
                );

        int position = (int) activeReservations + 1;


        // Create reservation
        Reservation reservation = new Reservation();

        long count = reservationRepo.count() + 4001;

        reservation.setReservationCode("RES-" + count);
        reservation.setMember(member);
        reservation.setBook(book);
        reservation.setWaitingPosition(position);
        reservation.setStatus("ACTIVE");

        // Existing system uses this field for notification status
        reservation.setNotificationSent(true);


        return reservationRepo.save(reservation);
    }


    // Cancel reservation
    public Reservation cancelReservation(Long reservationId) {

        Reservation reservation =
                reservationRepo.findById(reservationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Reservation not found"));

        reservation.setStatus("CANCELLED");

        return reservationRepo.save(reservation);
    }


    // Update reservation status
    public Reservation updateReservation(
            Long id,
            String status) {

        Reservation reservation =
                reservationRepo.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Reservation not found"));


        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Reservation status is required");
        }


        String newStatus = status.toUpperCase();


        // Validate status
        if (!newStatus.equals("ACTIVE") &&
                !newStatus.equals("CANCELLED") &&
                !newStatus.equals("FULFILLED") &&
                !newStatus.equals("EXPIRED")) {

            throw new IllegalArgumentException(
                    "Invalid reservation status");
        }


        reservation.setStatus(newStatus);

        return reservationRepo.save(reservation);
    }
}