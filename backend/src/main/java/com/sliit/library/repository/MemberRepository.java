package com.sliit.library.repository;

import com.sliit.library.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Data access operations for library members
@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByMemberCode(String memberCode);

    Optional<Member> findByEmail(String email);

    Optional<Member> findByPhone(String phone);

    Optional<Member> findByIdNumber(String idNumber);
}