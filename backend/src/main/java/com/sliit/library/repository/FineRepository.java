package com.sliit.library.repository;

import com.sliit.library.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Data access operations for member fines and payments
@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {
    Optional<Fine> findByFineCode(String fineCode);
    List<Fine> findByMemberId(Long memberId);
    List<Fine> findByMemberIdAndStatus(Long memberId, String status);
    List<Fine> findByStatus(String status);
}
