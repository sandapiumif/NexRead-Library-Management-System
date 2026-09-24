package com.sliit.library.repository;

import com.sliit.library.model.MembershipType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MembershipTypeRepository
        extends JpaRepository<MembershipType, Long> {

    Optional<MembershipType> findByTypeNameIgnoreCase(String typeName);
}