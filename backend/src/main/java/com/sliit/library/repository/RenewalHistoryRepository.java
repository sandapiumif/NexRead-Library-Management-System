package com.sliit.library.repository;

import com.sliit.library.model.RenewalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RenewalHistoryRepository
        extends JpaRepository<RenewalHistory, Long> {

    List<RenewalHistory> findByMemberIdOrderByRenewalDateDesc(
            Long memberId);
}
