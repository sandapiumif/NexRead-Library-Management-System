package com.sliit.library.repository;

import com.sliit.library.model.BorrowingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Data access operations for book borrowings and loans
@Repository
public interface BorrowingRepository extends JpaRepository<BorrowingRecord, Long> {
    Optional<BorrowingRecord> findByBorrowCode(String borrowCode);
    List<BorrowingRecord> findByMemberId(Long memberId);
    List<BorrowingRecord> findByBookId(Long bookId);
    List<BorrowingRecord> findByStatus(String status);
    long countByMemberIdAndStatus(Long memberId, String status);
}
