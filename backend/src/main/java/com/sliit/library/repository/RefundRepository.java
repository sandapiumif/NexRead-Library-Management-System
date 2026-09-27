package com.sliit.library.repository;

import com.sliit.library.model.Refund;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefundRepository extends JpaRepository<Refund, Long> {

    Optional<Refund> findByFine_Id(Long fineId);

    boolean existsByFine_Id(Long fineId);

    List<Refund> findByMemberId(Long memberId);
}