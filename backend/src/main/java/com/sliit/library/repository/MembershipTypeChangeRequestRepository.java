package com.sliit.library.repository;

import com.sliit.library.model.MembershipTypeChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MembershipTypeChangeRequestRepository
        extends JpaRepository<MembershipTypeChangeRequest, Long> {

    List<MembershipTypeChangeRequest>
    findByMemberIdOrderByRequestedAtDesc(Long memberId);

    List<MembershipTypeChangeRequest>
    findByStatusOrderByRequestedAtDesc(String status);
}
