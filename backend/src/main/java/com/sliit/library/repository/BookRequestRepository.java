package com.sliit.library.repository;

import com.sliit.library.model.BookRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Data access operations for member book requests
@Repository
public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    Optional<BookRequest> findByRequestCode(String requestCode);
    List<BookRequest> findByMemberId(Long memberId);
    List<BookRequest> findByStatus(String status);
}
