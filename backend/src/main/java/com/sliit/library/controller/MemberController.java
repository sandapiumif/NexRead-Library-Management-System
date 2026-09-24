package com.sliit.library.controller;

import com.sliit.library.model.Member;
import com.sliit.library.service.MemberService;
import com.sliit.library.model.RenewalHistory;
import com.sliit.library.repository.RenewalHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.sliit.library.repository.MembershipTypeChangeRequestRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private RenewalHistoryRepository renewalHistoryRepo;

    private final Path verificationUploadDirectory =
            Paths.get("uploads/verification-documents");

    @Autowired
    private MembershipTypeChangeRequestRepository
            membershipTypeChangeRequestRepository;

    // GET all members
    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // GET member by ID
    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(
            @PathVariable Long id) {

        return memberService.getMemberById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE member
    @PostMapping
    public ResponseEntity<?> registerMember(
            @RequestBody Member member) {

        try {

            return ResponseEntity.ok(
                    memberService.registerMember(member)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // UPDATE member status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateMemberStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        try {

            String status = body.get("status");

            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Status is required"));
            }

            return ResponseEntity.ok(
                    memberService.updateMemberStatus(id, status)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // APPROVE pending member
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveMember(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    memberService.approveMember(id)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // REJECT pending member
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectMember(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    memberService.rejectMember(id)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Renew expired membership
    @PostMapping("/{id}/renew")
    public ResponseEntity<?> renewMembership(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                    memberService.renewMembership(id)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(java.util.Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    // =========================================================
// REQUEST MEMBERSHIP TYPE CHANGE
// =========================================================

    @PostMapping("/{id}/membership-type-change-request")
    public ResponseEntity<?> requestMembershipTypeChange(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        try {

            String requestedMembershipType =
                    body.get("requestedMembershipType");

            String reason =
                    body.get("reason");

            return ResponseEntity.ok(
                    memberService.requestMembershipTypeChange(
                            id,
                            requestedMembershipType,
                            reason
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    // GET membership type change requests for a member
    @GetMapping("/{id}/membership-type-change-requests")
    public ResponseEntity<?> getMembershipTypeChangeRequests(
            @PathVariable Long id) {

        try {

            // Make sure member exists
            memberService.getMemberById(id)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Member not found"
                            )
                    );

            return ResponseEntity.ok(
                    membershipTypeChangeRequestRepository
                            .findByMemberIdOrderByRequestedAtDesc(id)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    // =========================================================
   // APPROVE MEMBERSHIP TYPE CHANGE
   // =========================================================

    @PutMapping("/membership-type-change-requests/{requestId}/approve")
    public ResponseEntity<?> approveMembershipTypeChange(
            @PathVariable Long requestId) {

        try {

            return ResponseEntity.ok(
                    memberService.approveMembershipTypeChange(
                            requestId
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    // =========================================================
   // REJECT MEMBERSHIP TYPE CHANGE
   // =========================================================

    @PutMapping("/membership-type-change-requests/{requestId}/reject")
    public ResponseEntity<?> rejectMembershipTypeChange(
            @PathVariable Long requestId) {

        try {

            return ResponseEntity.ok(
                    memberService.rejectMembershipTypeChange(
                            requestId
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }

    // GET member renewal history
    @GetMapping("/{id}/renewal-history")
    public ResponseEntity<?> getRenewalHistory(
            @PathVariable Long id) {

        List<RenewalHistory> history =
                renewalHistoryRepo
                        .findByMemberIdOrderByRenewalDateDesc(id);

        return ResponseEntity.ok(history);
    }

    // UPDATE member details
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMember(
            @PathVariable Long id,
            @RequestBody Member member) {

        try {

            return ResponseEntity.ok(
                    memberService.updateMember(id, member)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE / deactivate member
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMember(
            @PathVariable Long id) {

        try {

            memberService.deleteMember(id);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Member deactivated successfully"
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // =========================================================
    // UPLOAD VERIFICATION DOCUMENT
    // =========================================================

    @PostMapping(
            value = "/{id}/verification-document",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadVerificationDocument(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        try {

            Member member = memberService.getMemberById(id)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Member not found"));

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Verification document is required"
                        ));
            }

            String originalFileName =
                    file.getOriginalFilename();

            if (originalFileName == null ||
                    originalFileName.trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Invalid file name"
                        ));
            }

            String contentType = file.getContentType();

            if (contentType == null ||
                    (!contentType.equals("application/pdf") &&
                            !contentType.equals("image/jpeg") &&
                            !contentType.equals("image/png"))) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Only PDF, JPG and PNG files are allowed"
                        ));
            }

            // Maximum 5 MB
            if (file.getSize() > 5 * 1024 * 1024) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "File size must not exceed 5 MB"
                        ));
            }

            Files.createDirectories(
                    verificationUploadDirectory
            );

            String extension = "";

            int dotIndex =
                    originalFileName.lastIndexOf('.');

            if (dotIndex >= 0) {
                extension =
                        originalFileName.substring(dotIndex);
            }

            String storedFileName =
                    UUID.randomUUID() + extension;

            Path targetPath =
                    verificationUploadDirectory.resolve(
                            storedFileName
                    );

            Files.copy(
                    file.getInputStream(),
                    targetPath
            );

            member.setVerificationDocument(
                    targetPath.toString()
            );

            member.setVerificationDocumentName(
                    originalFileName
            );

            // Every newly uploaded document requires verification
            member.setVerificationStatus("PENDING");

            Member savedMember =
                    memberService.saveMember(member);

            return ResponseEntity.ok(savedMember);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));

        } catch (IOException e) {

            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error",
                            "Failed to save verification document"
                    ));
        }
    }

    // =========================================================
    // VIEW VERIFICATION DOCUMENT
    // =========================================================

    @GetMapping("/{id}/verification-document")
    public ResponseEntity<?> viewVerificationDocument(
            @PathVariable Long id) {

        try {

            Member member = memberService.getMemberById(id)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Member not found"));

            if (member.getVerificationDocument() == null ||
                    member.getVerificationDocument().trim().isEmpty()) {

                return ResponseEntity.notFound().build();
            }

            Path filePath =
                    Paths.get(member.getVerificationDocument());

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource =
                    new UrlResource(
                            filePath.toUri()
                    );

            String contentType =
                    Files.probeContentType(filePath);

            if (contentType == null) {
                contentType =
                        MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(
                            MediaType.parseMediaType(contentType)
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" +
                                    member.getVerificationDocumentName() +
                                    "\""
                    )
                    .body(resource);

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error",
                            "Unable to open verification document"
                    ));
        }
    }

    // =========================================================
    // VERIFY / REJECT DOCUMENT
    // =========================================================

    @PutMapping("/{id}/verification-status")
    public ResponseEntity<?> updateVerificationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        try {

            String verificationStatus =
                    body.get("verificationStatus");

            if (verificationStatus == null ||
                    verificationStatus.trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "error",
                                "Verification status is required"
                        ));
            }

            return ResponseEntity.ok(
                    memberService.updateVerificationStatus(
                            id,
                            verificationStatus
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage()
                    ));
        }
    }
}