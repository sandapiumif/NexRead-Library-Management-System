package com.sliit.library.controller;

import com.sliit.library.model.MembershipType;
import com.sliit.library.service.MembershipTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/membership-types")
@CrossOrigin(origins = "*")
public class MembershipTypeController {

    @Autowired
    private MembershipTypeService membershipTypeService;

    // GET all membership types
    @GetMapping
    public List<MembershipType> getAllMembershipTypes() {
        return membershipTypeService.getAllMembershipTypes();
    }

    // GET membership type by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getMembershipTypeById(
            @PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    membershipTypeService
                            .getMembershipTypeById(id)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.notFound().build();
        }
    }

    // CREATE membership type
    @PostMapping
    public ResponseEntity<?> createMembershipType(
            @RequestBody MembershipType membershipType) {

        try {
            return ResponseEntity.ok(
                    membershipTypeService
                            .createMembershipType(membershipType)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // UPDATE membership type
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMembershipType(
            @PathVariable Long id,
            @RequestBody MembershipType membershipType) {

        try {
            return ResponseEntity.ok(
                    membershipTypeService
                            .updateMembershipType(
                                    id,
                                    membershipType)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE membership type
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMembershipType(
            @PathVariable Long id) {

        try {

            membershipTypeService
                    .deleteMembershipType(id);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Membership type deleted successfully"
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}