package com.sliit.library.repository;

import com.sliit.library.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Data access operations for reservations and waiting lists
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByReservationCode(String reservationCode);
    List<Reservation> findByMemberId(Long memberId);
    List<Reservation> findByBookIdAndStatus(Long bookId, String status);
    List<Reservation> findByStatus(String status);
    long countByBookIdAndStatus(Long bookId, String status);
}
