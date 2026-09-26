package com.sliit.library.repository;

import com.sliit.library.model.BorrowingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowingRequestRepository extends JpaRepository<BorrowingRequest, Long> {
    Optional<BorrowingRequest> findByRequestCode(String requestCode);
    List<BorrowingRequest> findByMemberId(Long memberId);
    List<BorrowingRequest> findByStatus(String status);
    boolean existsByMemberIdAndBookIdAndStatus(Long memberId, Long bookId, String status);
}
