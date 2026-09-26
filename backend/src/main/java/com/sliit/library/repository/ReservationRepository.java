package com.sliit.library.repository;

import com.sliit.library.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    boolean existsByMemberIdAndBookIdAndStatus(
            Long memberId,
            Long bookId,
            String status
    );

    long countByBookIdAndStatus(Long bookId, String status);

    List<Reservation> findByBookIdAndStatus(Long bookId, String status);
}
