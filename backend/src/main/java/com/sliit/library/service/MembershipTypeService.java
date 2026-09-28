package com.sliit.library.service;

import com.sliit.library.model.MembershipType;
import com.sliit.library.repository.MembershipTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.List;

@Service
public class MembershipTypeService {

    @Autowired
    private MembershipTypeRepository membershipTypeRepo;

    // Get all membership types
    public List<MembershipType> getAllMembershipTypes() {
        return membershipTypeRepo.findAll();
    }

    // Get membership type by ID
    public MembershipType getMembershipTypeById(Long id) {
        return membershipTypeRepo.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Membership type not found"));
    }

    // Create membership type
    public MembershipType createMembershipType(
            MembershipType membershipType) {

        validateMembershipType(membershipType);

        if (membershipTypeRepo
                .findByTypeNameIgnoreCase(
                        membershipType.getTypeName().trim())
                .isPresent()) {

            throw new IllegalArgumentException(
                    "A membership type with this name already exists");
        }

        membershipType.setTypeName(
                membershipType.getTypeName().trim());

        return membershipTypeRepo.save(membershipType);
    }

    // Update membership type
    public MembershipType updateMembershipType(
            Long id,
            MembershipType updatedType) {

        MembershipType existing =
                getMembershipTypeById(id);

        validateMembershipType(updatedType);

        membershipTypeRepo
                .findByTypeNameIgnoreCase(
                        updatedType.getTypeName().trim())
                .ifPresent(found -> {
                    if (!found.getId().equals(id)) {
                        throw new IllegalArgumentException(
                                "A membership type with this name already exists");
                    }
                });

        existing.setTypeName(
                updatedType.getTypeName().trim());

        existing.setBorrowLimit(
                updatedType.getBorrowLimit());

        existing.setMembershipDurationMonths(
                updatedType.getMembershipDurationMonths());

        existing.setFeeAmount(
                updatedType.getFeeAmount());

        return membershipTypeRepo.save(existing);
    }

    // Delete membership type
    public void deleteMembershipType(Long id) {

        MembershipType membershipType =
                getMembershipTypeById(id);

        membershipTypeRepo.delete(membershipType);
    }

    // Validation
    private void validateMembershipType(
            MembershipType membershipType) {

        if (membershipType.getTypeName() == null ||
                membershipType.getTypeName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Membership type name is required");
        }

        if (membershipType.getBorrowLimit() <= 0) {

            throw new IllegalArgumentException(
                    "Borrow limit must be greater than 0");
        }

        if (membershipType.getMembershipDurationMonths() <= 0) {

            throw new IllegalArgumentException(
                    "Membership duration must be greater than 0");
        }

        // Fee is optional for existing records.
        // If provided, it cannot be negative.
        if (membershipType.getFeeAmount() != null &&
                membershipType.getFeeAmount()
                        .compareTo(BigDecimal.ZERO) < 0) {

            throw new IllegalArgumentException(
                    "Membership fee cannot be negative");
        }
    }

    @PostConstruct
    public void initializeMembershipTypes() {

        if (membershipTypeRepo.count() == 0) {

            MembershipType student =
                    new MembershipType();

            student.setTypeName("Student");
            student.setBorrowLimit(3);
            student.setMembershipDurationMonths(12);

            MembershipType staff =
                    new MembershipType();

            staff.setTypeName("Staff");
            staff.setBorrowLimit(6);
            staff.setMembershipDurationMonths(12);

            MembershipType publicType =
                    new MembershipType();

            publicType.setTypeName("Public");
            publicType.setBorrowLimit(2);
            publicType.setMembershipDurationMonths(12);

            membershipTypeRepo.save(student);
            membershipTypeRepo.save(staff);
            membershipTypeRepo.save(publicType);
        }
    }
}